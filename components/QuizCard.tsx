import Link from 'next/link'
import { Quiz } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Edit, Eye, Copy, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface QuizCardProps {
  quiz: Quiz
}

export default function QuizCard({ quiz}: QuizCardProps) {
 
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/take-quiz/${quiz.id}`
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl)
    // You could add a toast notification here
  }

 

  // Get question type summary
  const getQuestionTypeSummary = () => {
    if (!quiz.questions || quiz.questions.length === 0) return []
    
    const typeCounts = quiz.questions.reduce((acc, question) => {
      acc[question.type] = (acc[question.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(typeCounts).map(([type, count]) => ({
      type: type.replace('_', ' ').toLowerCase(),
      count
    }))
  }

  const questionTypes = getQuestionTypeSummary()
  const hasResponses = (quiz.responseCount || 0) > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold">
              {quiz.title}
              {hasResponses && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Has Responses
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Created {formatDate(quiz.createdAt)} • {quiz.questions?.length || 0} questions
            </CardDescription>
          </div>
        </div>
        
        {/* Question Type Summary */}
        {questionTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {questionTypes.map(({ type, count }) => (
              <Badge key={type} variant="outline" className="text-xs">
                {count} {type}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Link href={`/quiz/${quiz.id}/responses`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Responses
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
            
            <Link href={`/take-quiz/${quiz.id}`} target="_blank">
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </Link>
          </div>

          {/* Public URL Display */}
          <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
            Public URL: /take-quiz/{quiz.id}
          </div>
          
          {/* Response Count */}
          {quiz.responseCount !== undefined && (
            <div className="text-sm text-gray-500">
              {quiz.responseCount} responses
            </div>
          )}

          {/* Warning for quizzes with responses */}
          {hasResponses && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span>This quiz has responses. Editing may affect existing data.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}