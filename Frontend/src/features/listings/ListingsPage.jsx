import { useEffect, useState } from "react";
import api from "@/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "./components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch data from the /api/listings/ endpoint
        const response = await api.get("/listings/");
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
        // Optionally, set an error state here to show a message to the user
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };
    fetchListings();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-sm border">
          <div className="relative w-full md:w-auto md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by city, address, or keyword..."
              className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <Button variant="outline" size="lg" className="h-12 w-full md:w-auto">
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Conditional Rendering based on loading state */}
        {loading ? (
          // Skeleton Loader UI while fetching data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square w-full bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          // Display Listings once data is fetched
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}