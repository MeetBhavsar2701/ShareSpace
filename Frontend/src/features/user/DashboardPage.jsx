import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/features/listings/components/ListingCard";

const mockListing = {
  id: 1,
  title: "Sunny Downtown Loft",
  location: "Urban Core, Metro City",
  rent: 1200,
  match: 92,
  image: "/no-image.png", // Use local image instead of via.placeholder.com
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">My Sharespace</h1>
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Listings</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListingCard listing={mockListing} />
              </CardContent>
            </Card>
          </TabsContent>

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
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListingCard listing={mockListing} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}