"use client"

import { useState } from "react"
import { useProfiles } from "./profile-provider"
import { ProfileForm } from "./profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

export function AdminPanel() {
  const { profiles, deleteProfile } = useProfiles()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingProfile, setIsAddingProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditProfile = (profile) => {
    setEditingProfile(profile)
    setIsAddingProfile(false)
  }

  const handleDeleteProfile = (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      deleteProfile(id)
    }
  }

  const handleFormClose = () => {
    setIsAddingProfile(false)
    setEditingProfile(null)
  }

  return (
    <div className="space-y-6">
      {isAddingProfile || editingProfile ? (
        <ProfileForm profile={editingProfile} onClose={handleFormClose} />
      ) : (
        <>
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-6">
              <div>
                <CardTitle className="text-white">Manage Profiles</CardTitle>
                <CardDescription className="text-gray-400">Add, edit, or remove profiles from the system.</CardDescription>
              </div>
              <Button 
                onClick={() => setIsAddingProfile(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Profile
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search profiles..."
                  className="pl-8 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow className="border-b-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-300">Profile</TableHead>
                      <TableHead className="text-gray-300">Location</TableHead>
                      <TableHead className="w-[100px] text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-gray-800">
                    {filteredProfiles.length === 0 ? (
                      <TableRow className="hover:bg-gray-700 border-b-gray-700">
                        <TableCell colSpan={3} className="text-center h-24 text-gray-400">
                          No profiles found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfiles.map((profile) => (
                        <TableRow key={profile.id} className="hover:bg-gray-700 border-b-gray-700">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-blue-500">
                                <AvatarImage src={profile.photo || "/placeholder.svg"} alt={profile.name} />
                                <AvatarFallback className="bg-blue-900 text-white">{profile.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{profile.name}</div>
                                <div className="text-sm text-blue-300">{profile.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{profile.address}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditProfile(profile)}
                                className="hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteProfile(profile.id)}
                                className="hover:bg-gray-700 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
