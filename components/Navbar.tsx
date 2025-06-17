'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { User } from '@/types'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    checkAuth()
  }, [])

  // Also check auth when the component becomes visible (helpful for page navigation)
  useEffect(() => {
    const handleFocus = () => {
      if (isClient && !loading) {
        checkAuth()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isClient, loading])

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      console.log('Checking auth, token exists:', !!token)
      
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Auth response status:', response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log('User data received:', userData)
        setUser(userData)
      } else {
        // Token might be invalid, remove it
        console.log('Auth failed, removing token')
        localStorage.removeItem('token')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // On error, assume not authenticated
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      
      // Call the signout endpoint
      await fetch('/api/auth/signout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Clear local storage
      localStorage.removeItem('token')
      
      // Update state
      setUser(null)
      
      // Redirect to home
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Even if the API call fails, clear local state
      localStorage.removeItem('token')
      setUser(null)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading || !isClient) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Questa Lite
            </Link>
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Questa Lite
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut} disabled={loading}>
                  {loading ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="default">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}