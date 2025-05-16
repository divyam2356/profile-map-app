"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AdminPanel } from "@/components/admin-panel"
import { ProfileProvider } from "@/components/profile-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = sessionStorage.getItem('isAdminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      // Redirect to home if not authenticated
      router.push('/')
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-screen">
        <p className="text-lg text-gray-200">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // This will not render since we redirect in useEffect
  }

  return (
    <ProfileProvider>
      <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profiles
            </Button>
          </Link>
        </div>
        <AdminPanel />
      </div>
    </ProfileProvider>
  )
}
