import { useEffect, useState } from "react";
import { api } from "@/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/users/favorites/");
        setFavorites(response.data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Heart className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
          <h1 className="text-4xl font-bold">Saved Listings</h1>
          <p className="text-xl text-gray-600 mt-4">
            Your favorite listings are saved here for you to review.
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading your favorites...</p>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Saved Listings Yet</h2>
            <p className="text-gray-600 mt-4">Click the heart icon on any listing to save it here.</p>
            <Link to="/listings">
              <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600">Browse Listings</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}