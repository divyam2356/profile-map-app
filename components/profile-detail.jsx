import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AtSign, Mail, MapPin, Phone } from "lucide-react"

export function ProfileDetail({ profile }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.photo || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
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
        <CardHeader>
          <h3 className="text-xl font-semibold">About</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>{profile.description}</p>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
            <div
              className="w-full h-64 bg-muted rounded-md flex items-center justify-center"
              style={{
                backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+f43f5e(${profile.location.lng},${profile.location.lat})/${profile.location.lng},${profile.location.lat},12,0/600x400?access_token=pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xnNXRtcWRqMDh1eTNkcGZyaHJvdHdvdSJ9.xmtzjpDu5XFS3z_G0qKXBg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-destructive" />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
