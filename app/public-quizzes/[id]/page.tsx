// app/public-quiz/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface Question {
  id: string
  text: string
  type: 'SINGLE_CHOICE' | 'TEXT'
  options: string[]
  required: boolean
  order: number
}

interface QuizDetails {
  id: string
  title: string
  description?: string
  creatorName: string
  questions: Question[]
  responseCount: number
}

interface Answer {
  questionId: string
  value: string
}

// Updated interface for Next.js 15+ async params
interface PageProps {
  params: Promise<{ id: string }>
}

export default function TakeQuizPage({ params }: PageProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<QuizDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [quizId, setQuizId] = useState<string | null>(null)

  // Resolve params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setQuizId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const fetchQuiz = async () => {
    if (!quizId) return
    
    try {
      const response = await fetch(`/api/quizzesPublic/${quizId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Quiz not found')
        }
        throw new Error('Failed to fetch quiz')
      }
      const data = await response.json()
      setQuiz(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId ? { ...a, value } : a
        )
      } else {
        return [...prev, { questionId, value }]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quiz || !quizId) return

    // Check required fields
    const requiredQuestions = quiz.questions.filter(q => q.required)
    const answeredQuestionIds = answers.map(a => a.questionId)
    const missingRequired = requiredQuestions.filter(
      q => !answeredQuestionIds.includes(q.id)
    )

    if (missingRequired.length > 0) {
      setError('Please answer all required questions')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/quizzesPublic/${quizId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          submitterName,
          submitterEmail,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit response')
      }

      // Redirect to success page or show success message
      router.push(`/quiz-submitted?quizTitle=${encodeURIComponent(quiz.title)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push('/public-quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Quiz not found</p>
          <Button onClick={() => router.push('/public-quizzes')} className="mt-4">
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <Badge variant="secondary">
                {quiz.questions.length} questions
              </Badge>
            </div>
            {quiz.description && (
              <CardDescription>{quiz.description}</CardDescription>
            )}
            <p className="text-sm text-muted-foreground">
              Created by: <span className="font-medium">{quiz.creatorName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {quiz.responseCount} people have taken this quiz
            </p>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submitter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Information (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          {quiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {question.text}
                  {question.required && (
                    <Badge variant="destructive" className="ml-2">Required</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.type === 'SINGLE_CHOICE' ? (
                  <RadioGroup
                    value={answers.find(a => a.questionId === question.id)?.value || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={answers.find(a => a.questionId === question.id)?.value || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    rows={4}
                  />
                )}
              </CardContent>
            </Card>
          ))}

          {error && (
            <div className="text-red-500 text-center p-4 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/public-quizzes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}