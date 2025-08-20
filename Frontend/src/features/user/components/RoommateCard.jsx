import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, User } from "lucide-react";

export const RoommateCard = ({ match }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out text-center">
      <CardContent className="p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 border-4 border-gray-200 mb-4">
          <AvatarImage src={match.lister_avatar_url} alt={match.lister_username} />
          <AvatarFallback className="text-3xl">
            {match.lister_username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-semibold text-xl text-gray-900">{match.lister_username}</h3>
        
        <Badge className="bg-emerald-500 text-white text-md px-3 py-1 my-3">
          {match.compatibility_score}% Match
        </Badge>

        <p className="text-gray-500 flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Has a room in {match.city}
        </p>
        
        <div className="mt-4 w-full">
            {/* --- FIX: Changed link to match the route in App.jsx --- */}
            <Link to={`/users/${match.lister_id}`}>
                <Button className="w-full">
                    <User className="w-4 h-4 mr-2" /> View Profile
                </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
};
