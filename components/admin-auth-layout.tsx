'use client'

import '@/lib/amplify-configure'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { LogOut, Loader2 } from 'lucide-react'

export function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) return <>{children}</>

  return <AuthGuard>{children}</AuthGuard>
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      await getCurrentUser()
      const session = await fetchAuthSession()
      const groups = (session.tokens?.accessToken?.payload?.['cognito:groups'] as string[]) || []
      if (groups.includes('Admin')) {
        setAuthorized(true)
      } else {
        router.replace('/admin/login?error=unauthorized')
      }
    } catch {
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-deep-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="font-serif text-xl font-bold text-gold">Da Sergio Admin</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-text hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
