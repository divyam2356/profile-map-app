"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ProfileDetail } from "@/components/profile-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const profileId = params.id
    const storedProfiles = localStorage.getItem("profiles")

    if (storedProfiles) {
      const profiles = JSON.parse(storedProfiles)
      const foundProfile = profiles.find((p) => p.id === profileId)

      if (foundProfile) {
        setProfile(foundProfile)
      } else {
  
        router.push("/")
      }
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profiles
          </Button>
        </Link>
      </div>
      <ProfileDetail profile={profile} />
    </div>
  )
}
