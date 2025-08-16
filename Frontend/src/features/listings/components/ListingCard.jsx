import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";

export function ListingCard({ listing }) {
  return (
    <Card className="w-full overflow-hidden group">
      <CardHeader className="p-0 relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full"
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold leading-tight">{listing.title}</h3>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 shrink-0">{listing.match}% Match</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{listing.location}</p>
        <p className="text-xl font-semibold mt-2">${listing.price}/month</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <a href="/listing/1">View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
}