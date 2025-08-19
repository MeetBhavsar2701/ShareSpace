import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Sparkles } from "lucide-react";
import api from "@/api";
import { toast } from "sonner";

export function ListingCard({ listing }) {
  const [isFavorited, setIsFavorited] = useState(listing.is_favorited);
  const displayImage = listing.image_url || '/no-image.png';

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    try {
        await api.post('/users/favorites/toggle/', { listing_id: listing.id });
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? "Removed from favorites." : "Added to favorites!");
    } catch (error) {
        toast.error("Please log in to save listings.");
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-lg">
      <Link to={`/listings/${listing.id}`}>
        <div className="relative">
          {/* --- Image and Gradient --- */}
          <img
            src={displayImage}
            alt={listing.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* --- Content Overlay --- */}
          <div className="absolute bottom-0 left-0 p-4 text-white w-full">
            <h3 className="font-bold text-lg leading-tight truncate">{listing.title}</h3>
            <div className="flex items-center text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{listing.city}</span>
            </div>
          </div>
          
          {/* --- FIX: Redesigned Rent Badge for Better Legibility --- */}
          <Badge 
            className="absolute bottom-4 right-4 font-bold text-lg bg-white/80 backdrop-blur-sm text-gray-900 border border-white/20"
          >
            ₹{listing.rent?.toLocaleString('en-IN') || 'N/A'}
          </Badge>
        </div>
      </Link>
      
      {/* --- Favorite Button --- */}
      <button 
        onClick={handleFavoriteToggle}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow"
      >
        <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
      </button>

      {/* --- Compatibility Score --- */}
      {listing.compatibility_score && listing.compatibility_score > 0 && (
          <Badge className="absolute top-3 left-3 z-10 bg-emerald-500 text-white font-bold text-md flex items-center gap-1.5 py-1 px-2.5 shadow-lg">
              <Sparkles className="w-4 h-4" />
              {listing.compatibility_score}% Match
          </Badge>
      )}
    </div>
  );
}