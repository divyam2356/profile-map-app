"use client"

import { useState } from "react"
import { useProfiles } from "./profile-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

export function ProfileForm({ profile, onClose }) {
  const { addProfile, updateProfile } = useProfiles()
  const [formData, setFormData] = useState(
    profile || {
      id: crypto.randomUUID(),
      name: "",
      photo: "/placeholder.svg?height=150&width=150",
      description: "",
      location: { lat: 0, lng: 0 },
      address: "",
      email: "",
      phone: "",
      interests: [],
      socialMedia: {
        twitter: "",
        linkedin: "",
      },
    },
  )
  const [interestsInput, setInterestsInput] = useState(profile ? profile.interests.join(", ") : "")
  const [errors, setErrors] = useState({})
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("socialMedia.")) {
      const socialKey = name.split(".")[1]
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialKey]: value,
        },
      })
    } else if (name.startsWith("location.")) {
      const locationKey = name.split(".")[1]
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationKey]: Number.parseFloat(value) || 0,
        },
      })
    } else if (name === "interests") {
      setInterestsInput(value)
      setFormData({
        ...formData,
        interests: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (formData.location.lat === 0 && formData.location.lng === 0) {
      newErrors["location.lat"] = "Location coordinates are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (profile) {
      updateProfile(formData)
    } else {
      addProfile(formData)
    }

    onClose()
  }

  // Function to get the user's current location
  const getUserLocation = () => {
    setIsGettingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success handler
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
        setIsGettingLocation(false)
      },
      (error) => {
        // Error handler
        let errorMessage = "Unable to retrieve your location"
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission was denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <CardTitle>{profile ? "Edit Profile" : "Add New Profile"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location.lat">Latitude</Label>
              <div className="flex space-x-2">
                <Input
                  id="location.lat"
                  name="location.lat"
                  type="number"
                  step="any"
                  value={formData.location.lat || ""}
                  onChange={handleChange}
                  className={errors["location.lat"] ? "border-destructive" : ""}
                />
                {errors["location.lat"] && <p className="text-sm text-destructive">{errors["location.lat"]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location.lng">Longitude</Label>
              <div className="flex space-x-2">
                <Input
                  id="location.lng"
                  name="location.lng"
                  type="number"
                  step="any"
                  value={formData.location.lng || ""}
                  onChange={handleChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                  className="whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-none"
                >
                  {isGettingLocation ? "Getting..." : "Get My Location"}
                </Button>
              </div>
              {locationError && (
                <p className="text-sm text-destructive">{locationError}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma separated)</Label>
            <Input
              id="interests"
              name="interests"
              value={interestsInput}
              onChange={handleChange}
              placeholder="e.g. Coding, Hiking, Photography"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="socialMedia.twitter">Twitter Username</Label>
                <Input
                  id="socialMedia.twitter"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter || ""}
                  onChange={handleChange}
                  placeholder="username (without @)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia.linkedin">LinkedIn Username</Label>
                <Input
                  id="socialMedia.linkedin"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia.linkedin || ""}
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{profile ? "Update Profile" : "Add Profile"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
