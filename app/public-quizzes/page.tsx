// app/public-quizzes/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PublicQuiz {
  id: string
  title: string
  description?: string
  createdAt: string
  creatorName: string
  questionCount: number
  responseCount: number
}

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useState<PublicQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzesPublic')
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes')
      }
      const data = await response.json()
      setQuizzes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchQuizzes} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Quizzes</h1>
          <p className="text-xl text-muted-foreground">
            Choose a quiz to take and share your answers
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No quizzes available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back later for new quizzes!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge variant="secondary">
                      {quiz.questionCount} questions
                    </Badge>
                  </div>
                  {quiz.description && (
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Created by: <span className="font-medium">{quiz.creatorName}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Responses: <span className="font-medium">{quiz.responseCount}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/take-quiz/${quiz.id}`} className="w-full block">
                    <Button className="w-full">
                      Take Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline">
            <Link href="/" className="w-full h-full flex items-center justify-center">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}