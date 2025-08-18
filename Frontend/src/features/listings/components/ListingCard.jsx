import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";

export function ListingCard({ listing }) {
  // FIX: Use the 'image_url' field provided by the updated backend serializer
  const displayImage = listing.image_url || 'https://via.placeholder.com/300?text=No+Image';

  return (
    <div className="group relative">
      <Link to={`/listings/${listing.id}`}>
        <div className="rounded-xl overflow-hidden aspect-square">
            <img
              src={displayImage}
              alt={listing.title}
              className="aspect-square w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight truncate pr-2">{listing.title}</h3>
            <Badge variant="secondary" className="font-bold text-md flex-shrink-0">
              ₹{listing.rent.toLocaleString('en-IN')}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{listing.city}</span>
          </div>
        </div>
      </Link>
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
        <Heart className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}