import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Questa Lite</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create engaging quizzes and share them with the world
        </p>
        
        <div className="flex justify-center gap-4 mb-12">
          <Button size="lg">
            <Link href="/auth/signin" className="w-full h-full block">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/public-quizzes">Take Quize</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Easy Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create quizzes with multiple question types in minutes
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share your quizzes with anyone using public links
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View and analyze responses from quiz participants
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}