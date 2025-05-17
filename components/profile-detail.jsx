import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AtSign, Mail, MapPin, Phone } from "lucide-react"
import dynamic from "next/dynamic"

// Import the map component with no SSR to avoid Leaflet errors
const ProfileDetailMap = dynamic(() => import("./profile-detail-map"), {
  ssr: false
})

export function ProfileDetail({ profile }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader className="text-center px-4 py-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage src={profile.photo || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">{profile.name}</h2>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {profile.address}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Social Media</h3>
              <div className="space-y-2">
                {Object.entries(profile.socialMedia).map(([platform, username]) => (
                  <div key={platform} className="flex items-center">
                    <AtSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{platform}:</span>
                    <span className="ml-1 text-primary">@{username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="px-4 py-6">
          <h3 className="text-lg md:text-xl font-semibold">About</h3>
        </CardHeader>
        <CardContent className="px-4 pb-6 space-y-4 md:space-y-6">
          <p className="text-sm md:text-base">{profile.description}</p>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs md:text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
            <ProfileDetailMap profile={profile} />
            <div className="flex items-center mt-2">
              <MapPin className="mr-1 h-4 w-4 text-destructive" />
              <span className="text-xs md:text-sm">{profile.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
