"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingPage } from "@/components/ui/loading"

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [loading, isAuthenticated, router])

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage />
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return children
}
