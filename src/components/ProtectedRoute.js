"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingPage } from "@/components/ui/loading"

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
