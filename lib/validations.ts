// lib/validations.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      text: z.string().min(1, 'Question text is required'),
      type: z.enum(['SINGLE_CHOICE', 'TEXT']),
      options: z.array(z.string()).default([]),
      required: z.boolean().default(true),
      // Remove the order field from validation since it's set automatically
    })
  ).min(2, 'At least 2 questions are required'),
});

export const submitResponseSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  answers: z.array(
    z.object({
      questionId: z.string().min(1, 'Question ID is required'),
      value: z.string().min(1, 'Answer value is required'),
    })
  ).min(1, 'At least one answer is required'),
});




export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;