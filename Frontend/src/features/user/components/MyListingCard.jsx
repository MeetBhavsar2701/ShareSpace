import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MyListingCard({ listing, onDelete }) {
  const displayImage = listing.image_url || '/no-image.png';

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Link to={`/listings/${listing.id}`}>
          <img
            src={displayImage}
            alt={listing.title}
            className="aspect-video w-full object-cover hover:opacity-90 transition-opacity"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-2 flex-grow">
        <CardTitle className="text-lg truncate">
            <Link to={`/listings/${listing.id}`} className="hover:underline">
                {listing.title}
            </Link>
        </CardTitle>
        <div className="flex items-center text-sm text-gray-500 pt-2">
          <Heart className="w-4 h-4 mr-2 text-red-500" />
          <span>Favorited by {listing.favorites_count} {listing.favorites_count === 1 ? 'user' : 'users'}</span>
        </div>
         <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-2 text-blue-500" />
            <span>{listing.views} {listing.views === 1 ? 'view' : 'views'}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-2">
        <Link to={`/listings/${listing.id}/edit`} className="w-full">
          <Button variant="outline" className="w-full">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </Link>
        
        {/* --- DEBUGGING: Using a directly styled button to bypass variant issues --- */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* We apply direct Tailwind classes for styling to ensure visibility */}
            <Button className="bg-red-500 hover:bg-red-600 text-white w-1/2">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                listing from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(listing.id)} className="bg-red-500 hover:bg-red-600">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  );
}
