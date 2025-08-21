import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Sparkles, BedDouble, Bath, CalendarDays } from "lucide-react";
import api from "@/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    // ENHANCEMENT: The entire card is now the hoverable group with enhanced styling
    <div className="group relative block rounded-2xl overflow-hidden bg-white shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/listings/${listing.id}`}>
        {/* --- Image Container --- */}
        <div className="relative overflow-hidden">
          <img
            src={displayImage}
            alt={listing.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
          />
          {/* --- Favorite Button --- */}
          <button 
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow transition-colors z-20"
            aria-label="Toggle favorite"
          >
            {/* ENHANCEMENT: Heart icon now has a "pop" animation on click */}
            <motion.span whileTap={{ scale: 1.3 }} transition={{ duration: 0.1 }}>
              <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-700 hover:text-red-400'}`} />
            </motion.span>
          </button>

          {/* --- Compatibility Score --- */}
          {listing.compatibility_score && listing.compatibility_score > 0 && (
              <Badge className="absolute top-3 left-3 z-20 bg-emerald-500 text-white font-bold text-md flex items-center gap-1.5 py-1.5 px-3 shadow-lg border-2 border-white/50">
                  <Sparkles className="w-4 h-4" />
                  {listing.compatibility_score}% Match
              </Badge>
          )}
        </div>

        {/* --- ENHANCEMENT: New dedicated content section for better readability --- */}
        <div className="p-4 space-y-3">
          {/* Title and Location */}
          <div>
            <h3 className="font-bold text-lg text-stone-800 leading-tight truncate">{listing.title}</h3>
            <div className="flex items-center text-sm text-stone-500 mt-1">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{listing.city}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-xl font-extrabold text-stone-900">
            ₹{listing.rent?.toLocaleString('en-IN') || 'N/A'}
            <span className="text-sm font-medium text-stone-500"> / month</span>
          </div>

        </div>
      </Link>
    </div>
  );
}