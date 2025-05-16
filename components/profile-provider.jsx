"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ProfileContext = createContext(undefined)

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([])
  const [selectedProfileId, setSelectedProfileId] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load profiles from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfiles = localStorage.getItem("profiles")
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles))
      } else {
        // Initialize with dummy profiles if none exist
        setProfiles(dummyProfiles)
        localStorage.setItem("profiles", JSON.stringify(dummyProfiles))
      }
      setIsInitialized(true)
    }
  }, [])

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("profiles", JSON.stringify(profiles))
    }
  }, [profiles, isInitialized])

  const addProfile = (profile) => {
    setProfiles((prevProfiles) => [...prevProfiles, profile])
  }

  const updateProfile = (updatedProfile) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)),
    )
  }

  const deleteProfile = (id) => {
    setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id))
    if (selectedProfileId === id) {
      setSelectedProfileId(null)
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        selectedProfileId,
        setSelectedProfileId,
        addProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfiles() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfiles must be used within a ProfileProvider")
  }
  return context
}

// Dummy profiles for initial data
const dummyProfiles = [
  {
    id: "1",
    name: "John Doe",
    photo: "/placeholder.svg?height=150&width=150",
    description:
      "Software Engineer with 5 years of experience in React and Node.js. Passionate about building user-friendly web applications.",
    location: { lat: 40.7128, lng: -74.006 },
    address: "New York, NY",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    interests: ["Coding", "Hiking", "Photography", "Reading"],
    socialMedia: {
      twitter: "johndoe",
      linkedin: "johndoe",
      github: "johndoe",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    photo: "/placeholder.svg?height=150&width=150",
    description: "UX Designer passionate about user-centered design with expertise in Figma and Adobe Creative Suite.",
    location: { lat: 34.0522, lng: -118.2437 },
    address: "Los Angeles, CA",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    interests: ["Design", "Art", "Travel", "Photography"],
    socialMedia: {
      twitter: "janesmith",
      linkedin: "janesmith",
      dribbble: "janesmith",
    },
  },
  {
    id: "3",
    name: "Alex Johnson",
    photo: "/placeholder.svg?height=150&width=150",
    description: "Marketing Specialist with a focus on digital strategies and content creation for tech companies.",
    location: { lat: 41.8781, lng: -87.6298 },
    address: "Chicago, IL",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 456-7890",
    interests: ["Marketing", "Reading", "Cooking", "Running"],
    socialMedia: {
      twitter: "alexj",
      linkedin: "alexjohnson",
      instagram: "alexj",
    },
  },
  {
    id: "4",
    name: "Maria Garcia",
    photo: "/placeholder.svg?height=150&width=150",
    description:
      "Data Scientist specializing in machine learning and predictive analytics with 3 years of industry experience.",
    location: { lat: 29.7604, lng: -95.3698 },
    address: "Houston, TX",
    email: "maria.garcia@example.com",
    phone: "+1 (555) 234-5678",
    interests: ["Data Science", "AI", "Yoga", "Chess"],
    socialMedia: {
      twitter: "mariagarcia",
      linkedin: "mariagarcia",
      github: "mariagarcia",
    },
  },
  {
    id: "5",
    name: "David Kim",
    photo: "/placeholder.svg?height=150&width=150",
    description:
      "Full Stack Developer with expertise in MERN stack and cloud infrastructure. Currently working on e-commerce solutions.",
    location: { lat: 47.6062, lng: -122.3321 },
    address: "Seattle, WA",
    email: "david.kim@example.com",
    phone: "+1 (555) 876-5432",
    interests: ["Programming", "Gaming", "Hiking", "Music"],
    socialMedia: {
      twitter: "davidkim",
      linkedin: "davidkim",
      github: "davidkim",
    },
  },
  {
    id: "6",
    name: "Sarah Johnson",
    photo: "/placeholder.svg?height=150&width=150",
    description: "Product Manager with a background in psychology, focused on creating intuitive user experiences.",
    location: { lat: 37.7749, lng: -122.4194 },
    address: "San Francisco, CA",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 345-6789",
    interests: ["Product Design", "Psychology", "Cycling", "Meditation"],
    socialMedia: {
      twitter: "sarahj",
      linkedin: "sarahjohnson",
      medium: "sarahj",
    },
  },
  {
    id: "7",
    name: "Michael Brown",
    photo: "/placeholder.svg?height=150&width=150",
    description:
      "DevOps Engineer specializing in CI/CD pipelines and infrastructure automation using Kubernetes and Terraform.",
    location: { lat: 39.9526, lng: -75.1652 },
    address: "Philadelphia, PA",
    email: "michael.brown@example.com",
    phone: "+1 (555) 567-8901",
    interests: ["DevOps", "Cloud Computing", "Fishing", "Woodworking"],
    socialMedia: {
      twitter: "michaelb",
      linkedin: "michaelbrown",
      github: "michaelb",
    },
  },
  {
    id: "8",
    name: "Emily Wilson",
    photo: "/placeholder.svg?height=150&width=150",
    description: "Content Strategist and copywriter with experience in tech and healthcare industries.",
    location: { lat: 33.4484, lng: -112.074 },
    address: "Phoenix, AZ",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 678-9012",
    interests: ["Writing", "Blogging", "Photography", "Hiking"],
    socialMedia: {
      twitter: "emilyw",
      linkedin: "emilywilson",
      medium: "emilyw",
    },
  },
]
