import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { Map, Marker } from "pigeon-maps";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Home, Users } from "lucide-react";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await api.get(`/listings/${id}/`);
        setListing(response.data);
      } catch (error) {
        console.error("Failed to fetch listing details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListingDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found.</div>;

  const allImages = [
  listing.image_url || '/no-image.png',
  ...listing.images.map(img => img.image_url || '/no-image.png')
].filter(Boolean);

  const mapCenter = (listing.latitude && listing.longitude) ? [listing.latitude, listing.longitude] : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold">{listing.title}</h1>
                <div className="flex items-center text-lg text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{listing.address}, {listing.city}</span>
                </div>
            </div>
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.length > 0 ? allImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <img src={src} alt={`Listing image ${index + 1}`} className="rounded-xl w-full h-[450px] object-cover" />
                  </CarouselItem>
                )) : (
                  <CarouselItem>
                    <div className="rounded-xl w-full h-[450px] bg-gray-200 flex items-center justify-center text-muted-foreground">No Image Available</div>
                  </CarouselItem>
                )}
              </CarouselContent>
              {allImages.length > 1 && <> <CarouselPrevious className="ml-16" /> <CarouselNext className="mr-16" /> </>}
            </Carousel>
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold flex items-center gap-3"><Home />About this space</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
            {mapCenter && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold">Location</h2>
                <div className="mt-4 h-80 w-full rounded-lg overflow-hidden border">
                  <Map center={mapCenter} defaultZoom={14}>
                    <Marker width={40} anchor={mapCenter} color="#10B981" />
                  </Map>
                </div>
              </div>
            )}
          </div>
          <div className="relative lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold">
                    ₹{(listing.price || listing.rent).toLocaleString('en-IN')}  {/* FIX */}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </p>
                  <Button size="lg" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600">
                    Request to Connect
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Users/>Lister Information</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{listing.lister.username.charAt(0).toUpperCase()}</AvatarFallback> {/* FIX */}
                      </Avatar>
                      <div>
                        <p className="font-semibold">{listing.lister.username}</p> {/* FIX */}
                        <p className="text-sm text-muted-foreground">Joined recently</p>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
