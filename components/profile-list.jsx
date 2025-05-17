"use client"

import { useState } from "react"
import Link from "next/link"
import { useProfiles } from "./profile-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, User } from "lucide-react"

export function ProfileList() {
  const { profiles, setSelectedProfileId } = useProfiles()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 md:gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
          <Input
            type="search"
            placeholder="Search profiles by name, location, or description..."
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-300 w-full md:w-auto text-center md:text-right mt-2 md:mt-0">
          {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"} found
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-white">No profiles found</h3>
          <p className="mt-2 text-sm text-gray-400">
            Try adjusting your search terms or add new profiles in the admin panel.
          </p>
          <Link href="/admin">
            <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">Go to Admin Panel</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-500">
                    <AvatarImage src={profile.photo || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="bg-blue-600 text-white">{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 mt-2 md:mt-0">
                    <h3 className="font-medium leading-none text-white">{profile.name}</h3>
                    <div className="flex items-center text-sm text-blue-300">
                      <MapPin className="mr-1 h-3 w-3" />
                      {profile.address}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{profile.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row justify-between gap-2 p-4 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedProfileId(profile.id)}
                  className="w-full md:w-auto border-gray-600 bg-[#004687] text-gray-200 hover:bg-blue-900/40 hover:text-white hover:border-blue-500"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Show on Map
                </Button>
                <Link href={`/profile/${profile.id}`} className="w-full md:w-auto">
                  <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
