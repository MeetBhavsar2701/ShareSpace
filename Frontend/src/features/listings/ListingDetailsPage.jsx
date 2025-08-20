import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApi } from "@/api";
import api from "@/api"; 
import { Map, Marker } from "pigeon-maps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Home, Users, BedDouble, Cigarette, PawPrint, MessageSquare, Sparkles } from "lucide-react";

const InfoBadge = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-sm">
    {icon}
    <span className="font-medium text-gray-800">{text}</span>
  </div>
);

export default function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = sessionStorage.getItem('role');

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

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!listing || !listing.lister) {
    return <div className="flex h-screen items-center justify-center">Listing not found or data is incomplete.</div>;
  }

  const currentRoommates = Array.isArray(listing.current_roommates_details)
    ? listing.current_roommates_details
    : [];

  const allRoommates = [listing.lister, ...currentRoommates].filter(
    (r) => r && typeof r === "object" && r.id
  );

  const seen = new Set();
  const uniqueRoommates = allRoommates.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  const allImages = [
    listing.image_url,
    ...(Array.isArray(listing.images) ? listing.images.map((img) => img.image_url) : []),
  ].filter(Boolean);

  const mapCenter =
    listing.latitude && listing.longitude ? [listing.latitude, listing.longitude] : null;

  return (
    <div className="flex-grow container mx-auto py-12 px-4 md:px-6">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold">{listing.title}</h1>
            <div className="flex items-center text-lg text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                {listing.address}, {listing.city}
              </span>
            </div>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.length > 0 ? (
                allImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={src}
                      alt={`Listing image ${index + 1}`}
                      className="rounded-xl w-full h-[450px] object-cover border"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="rounded-xl w-full h-[450px] bg-gray-200 flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {allImages.length > 1 && (
              <>
                <CarouselPrevious className="ml-16" />{" "}
                <CarouselNext className="mr-16" />
              </>
            )}
          </Carousel>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">House Rules & Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoBadge
                icon={<BedDouble className="text-emerald-600 h-6 w-6" />}
                text={`${listing.roommates_needed} roommate(s) needed`}
              />
              <InfoBadge
                icon={<PawPrint className="text-emerald-600 h-6 w-6" />}
                text={listing.pets_allowed ? "Pets Allowed" : "No Pets"}
              />
              <InfoBadge
                icon={<Cigarette className="text-emerald-600 h-6 w-6" />}
                text={listing.smoking_allowed ? "Smoking Allowed" : "No Smoking"}
              />
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Home />
              About This Space
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {mapCenter && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="h-[300px] rounded-xl overflow-hidden border">
                <Map center={mapCenter} defaultZoom={14}>
                  <Marker width={50} anchor={mapCenter} />
                </Map>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  ₹{listing.rent.toLocaleString("en-IN")}{" "}
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userRole === 'Seeker' && listing.compatibility_score !== null && listing.compatibility_score !== undefined && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-800 text-lg">
                        {listing.compatibility_score}% Match
                      </p>
                      <p className="text-sm text-emerald-700">
                        Based on your lifestyle profile.
                      </p>
                    </div>
                  </div>
                )}
                <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message {listing.lister.username}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users />
                  Current Roommates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {uniqueRoommates.map((roommate) => (
                  <Link
                    to={`/users/${roommate.id}`}
                    key={roommate.id}
                    className="block group"
                  >
                    <Card className="transition-all duration-300 group-hover:shadow-md group-hover:border-emerald-500">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={roommate.avatar_url} />
                          <AvatarFallback>
                            {roommate.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-md">
                            {roommate.username}
                            {roommate.id === listing.lister.id && " (Lister)"}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {roommate.occupation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}