// app/api/quizzesPublic/[id]/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since it's a Promise in Next.js 13+
    const { id } = await params

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        creator: {
          select: { name: true, email: true }
        },
        responses: {
          select: { id: true }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      creatorName: quiz.creator.name || quiz.creator.email,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        required: q.required,
        order: q.order
      })),
      responseCount: quiz.responses.length
    }

    return NextResponse.json(formattedQuiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}