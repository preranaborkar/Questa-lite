// app/api/quizzesPublic/[id]/responses/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define types for the request body
interface AnswerInput {
  questionId: string
  value: string | number | boolean
}

interface RequestBody {
  answers: AnswerInput[]
  submitterName?: string
  submitterEmail?: string
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since it's a Promise in Next.js 13+
    const { id } = await params
    const body: RequestBody = await request.json()
    const { answers, submitterName, submitterEmail } = body

    console.log('=== API DEBUG ===')
    console.log('Quiz ID:', id)
    console.log('Received answers:', answers)
    console.log('Submitter info:', { submitterName, submitterEmail })

    // Input validation
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be provided as an array' },
        { status: 400 }
      )
    }

    // Validate that the quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
      include: { questions: true }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    console.log('Quiz found:', quiz.title)
    console.log('Quiz questions:', quiz.questions.map(q => ({ id: q.id, text: q.text, required: q.required })))

    // Validate required fields
    const requiredQuestions = quiz.questions.filter(q => q.required)
    const answeredQuestionIds = answers.map((a: AnswerInput) => a.questionId)
    
    console.log('Required questions:', requiredQuestions.map(q => q.id))
    console.log('Answered question IDs:', answeredQuestionIds)
    
    const missingRequired = requiredQuestions.filter(
      q => !answeredQuestionIds.includes(q.id)
    )

    if (missingRequired.length > 0) {
      console.log('Missing required questions:', missingRequired.map(q => q.id))
      return NextResponse.json(
        { 
          error: 'Please answer all required questions',
          missingQuestions: missingRequired.map(q => q.text)
        },
        { status: 400 }
      )
    }

    // Validate that all answers have required fields and non-empty values
    for (const answer of answers) {
      if (!answer.questionId || answer.value === undefined || answer.value === null || answer.value.toString().trim() === '') {
        console.log('Invalid answer found:', answer)
        return NextResponse.json(
          { error: 'Each answer must have questionId and a non-empty value' },
          { status: 400 }
        )
      }
    }

    console.log('All validations passed, creating response...')

    // Create response with answers
    const response = await prisma.response.create({
      data: {
        quizId: id,
        submitterName: submitterName || null,
        submitterEmail: submitterEmail || null,
      }
    })

    console.log('Response created with ID:', response.id)

    // Create all answers with better error handling
    const answerPromises = answers.map((answer: AnswerInput, index: number) => {
      console.log(`Creating answer ${index + 1}:`, answer)
      return prisma.answer.create({
        data: {
          responseId: response.id,
          questionId: answer.questionId,
          value: String(answer.value).trim() // Ensure value is a trimmed string
        }
      })
    })

    const createdAnswers = await Promise.all(answerPromises)
    console.log('All answers created:', createdAnswers.length)

    console.log('=== API DEBUG END ===')

    return NextResponse.json({
      id: response.id,
      message: 'Response submitted successfully',
      answersCount: createdAnswers.length
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting response:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit response', 
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
      },
      { status: 500 }
    )
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect()
  }
}