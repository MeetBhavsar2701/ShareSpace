import { useState, useEffect } from "react";
import api from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { toast } from "sonner";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(null);
  const [savedListings, setSavedListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingMine, setLoadingMine] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setUserRole(role);

    // Fetch saved listings
    const fetchSavedListings = async () => {
      try {
        const response = await api.get("/users/favorites/");
        setSavedListings(response.data);
      } catch (error) {
        toast.error("Could not fetch saved listings.");
        console.error("Failed to fetch saved listings:", error);
      } finally {
        setLoadingSaved(false);
      }
    };
    
    fetchSavedListings();

    // Fetch user's own listings if they are a Lister
    if (role === 'Lister') {
      const fetchMyListings = async () => {
        try {
          const response = await api.get("/listings/my-listings/");
          setMyListings(response.data);
        } catch (error) {
          toast.error("Could not fetch your listings.");
          console.error("Failed to fetch your listings:", error);
        } finally {
          setLoadingMine(false);
        }
      };
      fetchMyListings();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">My Sharespace</h1>
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className={`grid w-full ${userRole === 'Lister' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {userRole === 'Lister' && <TabsTrigger value="listings">My Listings</TabsTrigger>}
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          {userRole === 'Lister' && (
            <TabsContent value="listings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Your Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingMine ? (
                    <p>Loading your listings...</p>
                  ) : myListings.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
                    </div>
                  ) : (
                    <p>You haven't created any listings yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="matches" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Top Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Match content goes here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Messages content goes here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Saved Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSaved ? (
                  <p>Loading saved listings...</p>
                ) : savedListings.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
                  </div>
                ) : (
                  <p>You haven't saved any listings yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}