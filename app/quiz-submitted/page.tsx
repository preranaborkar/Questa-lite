// app/quiz-submitted/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

function QuizSubmittedContent() {
  const searchParams = useSearchParams()
  const quizTitle = searchParams.get('quizTitle') || 'the quiz'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for taking "{quizTitle}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your responses have been recorded. The quiz creator will be able to see your answers along with other participants' responses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Link href="/public-quizzes" className="w-full h-full flex items-center justify-center">
                  Take Another Quiz
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/" className="w-full h-full flex items-center justify-center">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Loading...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your responses have been recorded. The quiz creator will be able to see your answers along with other participants' responses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Link href="/public-quizzes" className="w-full h-full flex items-center justify-center">
                  Take Another Quiz
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/" className="w-full h-full flex items-center justify-center">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function QuizSubmittedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QuizSubmittedContent />
    </Suspense>
  )
}