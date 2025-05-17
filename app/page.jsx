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
      <div className="min-h-screen bg-gray-900 px-3 md:px-4 py-4 md:py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white">Profile Explorer</h1>
          <Button 
            className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 w-full md:w-auto mt-2 md:mt-0"
            onClick={openAuthModal}
          >
            <Lock className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        </div>
        
        <div className="w-full overflow-hidden px-2">
          <ProfileMap />
        </div>
        
        <div className="w-full max-w-6xl mt-6 md:mt-8 bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
          <ProfileList />
        </div>
        
        <AdminAuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </div>
    </ProfileProvider>
  )
}