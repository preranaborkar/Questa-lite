// app/api/quizzes/[id]/responses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify the JWT token
    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const { id } = await params; // Add this line
    const quizId = id; 

    

    // First verify that the quiz exists and belongs to the authenticated user
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { 
        id: true, 
        title: true, 
        creatorId: true 
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (quiz.creatorId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only view responses to your own quizzes' }, { status: 403 })
    }

    // Fetch all responses for this quiz with related data
    const responses = await prisma.response.findMany({
      where: { quizId },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                type: true,
                options: true
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    // Also get quiz questions for context
    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        text: true,
        type: true,
        options: true,
        order: true
      }
    })

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title
      },
      questions,
      responses,
      totalResponses: responses.length
    })

  } catch (error) {
    console.error('Error fetching quiz responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } 
}