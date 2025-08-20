import { useState, useEffect, useCallback } from "react";
import api from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { MyListingCard } from "@/features/user/components/MyListingCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoommateCard } from "./components/RoommateCard";

export default function DashboardPage() {
  // Initialize state directly from sessionStorage
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("role"));
  const [searchCity, setSearchCity] = useState(() => sessionStorage.getItem("user_city") || "");

  const [savedListings, setSavedListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [matches, setMatches] = useState([]);
  
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingMine, setLoadingMine] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const fetchMatches = useCallback(async (city) => {
    setLoadingMatches(true);
    try {
      const response = await api.get("/users/matches/", { params: { city } });
      setMatches(response.data);
    } catch (error) {
      toast.error("Could not fetch matches. Ensure your profile is complete.");
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch saved listings for everyone
      try {
        const savedRes = await api.get("/users/favorites/");
        setSavedListings(savedRes.data);
      } catch (error) {
        toast.error("Could not fetch saved listings.");
      } finally {
        setLoadingSaved(false);
      }

      // Fetch role-specific data
      const role = sessionStorage.getItem("role");
      const city = sessionStorage.getItem("user_city");

      if (role === 'Lister') {
        setLoadingMatches(false);
        try {
          const myListingsRes = await api.get("/listings/my-listings/");
          setMyListings(myListingsRes.data);
        } catch (error) {
          toast.error("Could not fetch your listings.");
        } finally {
          setLoadingMine(false);
        }
      } else if (role === 'Seeker' && city) {
        setLoadingMine(false);
        fetchMatches(city.trim());
      } else {
        setLoadingMatches(false);
        setLoadingMine(false);
      }
    };

    fetchInitialData();
  }, [fetchMatches]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchMatches(searchCity.trim());
    } else {
      toast.info("Please enter a city to search.");
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await api.delete(`/listings/${listingId}/delete/`);
      setMyListings(myListings.filter(listing => listing.id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the listing.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">My Sharespace</h1>
        <Tabs defaultValue={userRole === 'Lister' ? 'listings' : 'matches'} className="w-full">
          {/* --- CHANGE: Simplified and role-specific tabs --- */}
          <TabsList className="grid w-full grid-cols-3">
            {userRole === 'Lister' ? (
              <TabsTrigger value="listings">My Listings</TabsTrigger>
            ) : (
              <TabsTrigger value="matches">My Matches</TabsTrigger>
            )}
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          {/* My Listings tab (only for Listers) */}
          {userRole === 'Lister' && (
            <TabsContent value="listings" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Manage Your Listings</CardTitle></CardHeader>
                <CardContent>
                  {loadingMine ? <p>Loading your listings...</p> : myListings.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myListings.map(listing => (
                        <MyListingCard key={listing.id} listing={listing} onDelete={handleDeleteListing} />
                      ))}
                    </div>
                  ) : <p>You haven't created any listings yet.</p>}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* My Matches tab (only for Seekers) */}
          {userRole === 'Seeker' && (
            <TabsContent value="matches" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Top Roommate Matches</CardTitle>
                  <div className="flex w-full max-w-sm items-center space-x-2 pt-4">
                    <Input
                      type="text"
                      placeholder="Search by city..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingMatches ? (
                    <p>Finding your perfect roommate matches...</p>
                  ) : matches.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {matches.map(match => (
                        <RoommateCard key={match.lister_id} match={match} />
                      ))}
                    </div>
                  ) : (
                    <p>No matches found in this city. Try another location!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Common tabs for all users */}
          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Your Conversations</CardTitle></CardHeader>
              <CardContent><p>Messages content goes here...</p></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Your Saved Listings</CardTitle></CardHeader>
              <CardContent>
                {loadingSaved ? <p>Loading saved listings...</p> : savedListings.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
                  </div>
                ) : <p>You haven't saved any listings yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
