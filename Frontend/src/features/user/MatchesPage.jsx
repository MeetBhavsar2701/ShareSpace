import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

const MatchCard = ({ match }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={match.lister_avatar_url} />
                        <AvatarFallback>{match.lister_username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-xl text-gray-900">{match.lister_username}</h3>
                        <p className="text-gray-600">{match.listing_title}</p>
                    </div>
                </div>
                <Badge className="bg-emerald-500 text-white text-lg px-3 py-1">
                    {match.compatibility_score}% Match
                </Badge>
            </div>
            <img src={match.listing_image_url} alt={match.listing_title} className="w-full h-40 object-cover rounded-lg mb-4" />
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">₹{match.rent.toLocaleString('en-IN')}/month</p>
                <p className="text-md text-gray-600">in {match.city}</p>
            </div>
            <div className="flex space-x-2">
                <Button variant="outline" className="w-full"><Heart className="w-4 h-4 mr-2" /> Save</Button>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600"><MessageCircle className="w-4 h-4 mr-2" /> Message</Button>
            </div>
        </CardContent>
    </Card>
);

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await api.get("/users/matches/");
                setMatches(response.data);
            } catch (error) {
                console.error("Failed to fetch matches", error);
                toast.error(error.response?.data?.error || "Could not load your matches. Ensure your role is set to 'Seeker'.");
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Your Top Matches</h1>
                    <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto text-balance">
                        Based on your personality profile, these are the listers and rooms that are most compatible with your lifestyle.
                    </p>
                </div>

                {loading ? (
                    <p className="text-center">Finding your perfect matches...</p>
                ) : matches.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map(match => (
                            <MatchCard key={match.lister_id} match={match} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold">No Matches Found Yet</h2>
                        <p className="text-gray-600 mt-4">Make sure you have completed the onboarding quiz and your role is set to "Seeker".</p>
                        <Link to="/onboarding"><Button className="mt-6 bg-emerald-500 hover:bg-emerald-600">Complete My Profile</Button></Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}