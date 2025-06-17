'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import QuizCard from '@/components/QuizCard'
import { Quiz } from '@/types'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/signin')
        return
      }

      const response = await fetch('/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/auth/signin')
      } else {
        setError('Failed to fetch quizzes')
      }
    } catch (error) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your quizzes...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground">Manage your quizzes and view responses</p>
        </div>
        <Button>
          <Link href="/dashboard/create" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      {error && (
        <div className="text-destructive bg-destructive/10 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No quizzes yet</CardTitle>
            <CardDescription>
              Create your first quiz to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href="/dashboard/create">Create Your First Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  )
}