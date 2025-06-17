// app/api/quizzesPublic/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            questions: true,
            responses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const transformedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt,
      creatorName: quiz.creator.name || quiz.creator.email,
      questionCount: quiz._count.questions,
      responseCount: quiz._count.responses
    }))

    return NextResponse.json(transformedQuizzes)
  } catch (error) {
    console.error('Error fetching public quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}