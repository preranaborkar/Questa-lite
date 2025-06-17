'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Users } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  type: 'SINGLE_CHOICE' | 'TEXT'
  options: string[]
  order: number
}

interface Answer {
  id: string
  value: string
  questionId: string
  question: {
    id: string
    text: string
    type: 'SINGLE_CHOICE' | 'TEXT'
    options: string[]
  }
}

interface Response {
  id: string
  submittedAt: string
  submitterName?: string
  submitterEmail?: string
  answers: Answer[]
}

interface ResponsesData {
  quiz: {
    id: string
    title: string
  }
  questions: Question[]
  responses: Response[]
  totalResponses: number
}

export default function QuizResponsesPage() {
  const [data, setData] = useState<ResponsesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  useEffect(() => {
    fetchResponses()
  }, [quizId])

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/signin')
        return
      }

      const response = await fetch(`/api/quizzes/${quizId}/responses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setData(responseData)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/auth/signin')
      } else if (response.status === 403) {
        setError('You can only view responses to your own quizzes')
      } else if (response.status === 404) {
        setError('Quiz not found')
      } else {
        setError('Failed to fetch responses')
      }
    } catch (error) {
      setError('An error occurred while fetching responses')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    if (!data || data.responses.length === 0) return

    const headers = ['Submitted At', 'Submitter Name', 'Submitter Email', ...data.questions.map(q => q.text)]
    const rows = data.responses.map(response => {
      const row = [
        formatDate(response.submittedAt),
        response.submitterName || 'Anonymous',
        response.submitterEmail || 'N/A'
      ]
      
      data.questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id)
        row.push(answer?.value || 'No answer')
      })
      
      return row
    })

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.quiz.title}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading responses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-destructive mb-4">{error}</div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No data available</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{data.quiz.title}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            {data.totalResponses} responses
          </p>
        </div>
        {data.responses.length > 0 && (
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {data.responses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No responses yet</CardTitle>
            <CardDescription>
              Share your quiz to start collecting responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Quiz URL: {window.location.origin}/quiz/{quizId}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.responses.map((response, index) => (
            <Card key={response.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Response #{data.responses.length - index}</CardTitle>
                    <CardDescription>
                      Submitted on {formatDate(response.submittedAt)}
                      {response.submitterName && (
                        <span className="ml-2">
                          by <strong>{response.submitterName}</strong>
                        </span>
                      )}
                      {response.submitterEmail && (
                        <span className="ml-2 text-xs">
                          ({response.submitterEmail})
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.questions.map((question) => {
                    const answer = response.answers.find(a => a.questionId === question.id)
                    return (
                      <div key={question.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="font-medium text-sm mb-2 flex items-center gap-2">
                          {question.text}
                          <Badge variant="secondary" className="text-xs">
                            {question.type === 'SINGLE_CHOICE' ? 'Choice' : 'Text'}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          {answer?.value ? (
                            <div className="bg-gray-50 p-3 rounded border">
                              {answer.value}
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic">No answer provided</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}