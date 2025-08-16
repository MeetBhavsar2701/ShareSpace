import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// Assuming you have a RadarChart component for compatibility
// import { CompatibilityRadarChart } from "@/components/RadarChart";
import { Bath, BedDouble, CheckCircle, Home, Users, Wifi } from "lucide-react";

// Mock Data
const listing = {
  title: "Sunny Downtown Loft with Great Views",
  location: "Urban Core, Metro City",
  price: 1200,
  images: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1556702581-3701a0a2a7a8",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
  ],
  details: { bedrooms: 3, bathrooms: 2, roommates: 2 },
  description:
    "A beautiful, sunlit loft in the heart of the city, perfect for young professionals. Comes with a spacious living area, modern kitchen, and stunning city views. You'll be sharing with two friendly and tidy roommates who enjoy quiet evenings but are up for a weekend outing.",
  amenities: ["Wi-Fi", "In-unit Laundry", "Air Conditioning", "Dishwasher", "Furnished"],
  roommates: [
    { name: "Jessica", avatar: "https://i.pravatar.cc/150?img=1", bio: "Designer, loves plants and quiet nights." },
    { name: "Mike", avatar: "https://i.pravatar.cc/150?img=2", bio: "Software engineer, enjoys hiking and board games." },
  ],
};

export default function ListingDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Images and Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-bold">{listing.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{listing.location}</p>

            <Carousel className="w-full my-6">
              <CarouselContent>
                {listing.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={src}
                      alt={`Listing image ${index + 1}`}
                      className="rounded-xl w-full h-[450px] object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold">About this space</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-2xl font-bold">Amenities</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {listing.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking and Roommates */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <p className="text-3xl font-bold">
                  ${listing.price}
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </p>
                <Button size="lg" className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Request to Connect
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meet Your Future Roommates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.roommates.map((mate) => (
                  <div key={mate.name} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mate.avatar} />
                      <AvatarFallback>{mate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{mate.name}</p>
                      <p className="text-sm text-muted-foreground">{mate.bio}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}