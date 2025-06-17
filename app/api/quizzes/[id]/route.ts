import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
   context: { params: { id: string } }
) {
  try {
    const quizId = context.params.id

    // Optionally validate quizId format if needed (e.g., UUID or integer)
    // If using numeric IDs:
    // if (isNaN(Number(quizId))) {
    //   return NextResponse.json(
    //     { error: 'Invalid quiz ID format' },
    //     { status: 400 }
    //   )
    // }
    // If using UUIDs, use a regex for UUID validation.

    // Fetch quiz with questions from MongoDB
    const quiz = await prisma.quiz.findUnique({
      where: { 
        id: quizId 
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Transform the data to match your frontend expectations
    const transformedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt.toISOString(),
      questions: quiz.questions.map(question => ({
        id: question.id,
        question: question.text,
        text: question.text, // Map 'text' field to 'question' for frontend
        type: question.type,
        options: question.options,
        order: question.order,
        required: question.required
      }))
    }

    return NextResponse.json(transformedQuiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

