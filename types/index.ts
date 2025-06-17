import { ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  title: string
  description?: string
  creatorId: string // Changed from userId to creatorId to match Prisma schema
  createdAt: Date
  updatedAt: Date
  questions?: Question[]
  responses?: Response[]
  creator?: User // Changed from user to creator to match Prisma schema
  user?: User // Keep for backward compatibility
  // Additional fields for display
  creatorName?: string
  questionCount?: number
  responseCount?: number
}

export interface Question {
  id: string
  text: string // Changed from ReactNode to string to match Prisma schema
  quizId: string
  type: 'SINGLE_CHOICE' | 'TEXT'
  options?: string[]
  order: number
  required: boolean
  // Removed question field as it's redundant with text
  // Removed createdAt and updatedAt as they're not in Prisma schema
}

export interface Response {
  id: string
  quizId: string
  answers: Answer[]
  submittedAt: Date
  submitterName?: string
  submitterEmail?: string
}

export interface Answer {
  id: string
  responseId: string
  questionId: string
  value: string // Changed from answer to value to match Prisma schema
  // Removed createdAt as it's not in Prisma schema
}

export interface QuizWithDetails extends Quiz {
  questions: Question[]
  _count: {
    responses: number
  }
}

export interface CreateQuizData {
  title: string
  description?: string
  questions: {
    type: 'SINGLE_CHOICE' | 'TEXT'
    text: string // Changed from question to text
    options?: string[]
  }[]
}