'use client';

import { useState } from "react"
import { ProfileList } from "@/components/profile-list"
import ProfileMap from "@/components/profile-map"
import AdminAuthModal from "@/components/admin-auth-modal"
import { ProfileProvider } from "@/components/profile-provider"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-900 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Profile Explorer</h1>
          <Button 
            className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            onClick={openAuthModal}
          >
            <Lock className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        </div>
        
        <ProfileMap />
        
        <div className="w-full max-w-6xl mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <ProfileList />
        </div>
        
        <AdminAuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </div>
    </ProfileProvider>
  )
}