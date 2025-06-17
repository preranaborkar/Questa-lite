// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { createQuizSchema } from '@/lib/validations';
import { handleError, AppError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(request);
    if (!userPayload) {
      throw new AppError('Unauthorized', 401);
    }

    const quizzes = await prisma.quiz.findMany({
      where: { creatorId: userPayload.userId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(request);
    if (!userPayload) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));
    const validatedData = createQuizSchema.parse(body);

    const quiz = await prisma.quiz.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        creatorId: userPayload.userId,
        questions: {
          create: validatedData.questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            options: question.options,
            required: question.required,
            order: index
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}