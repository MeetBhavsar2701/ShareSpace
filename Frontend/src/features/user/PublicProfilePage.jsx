import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 픽스: Changed the import path from an alias to a relative path to resolve the build error.
import api from '../../api'; 
import { toast } from 'sonner';

// --- UI Components ---
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Icons ---
import { Home, Briefcase, Smile, Moon, Users, Cigarette, Dog, Utensils, MapPin, CheckCircle, XCircle } from 'lucide-react';

// A colorful trait badge for displaying user details
const ProfileTrait = ({ icon, label, value }) => {
    const renderValue = () => {
        if (typeof value === 'boolean') {
            return value ? (
                <span className="flex items-center gap-1.5 font-semibold text-green-700">
                    <CheckCircle className="h-4 w-4" /> Yes
                </span>
            ) : (
                <span className="flex items-center gap-1.5 font-semibold text-red-700">
                    <XCircle className="h-4 w-4" /> No
                </span>
            );
        }
        return <span className="font-semibold text-gray-800">{value || 'N/A'}</span>;
    };

    return (
        <div className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="text-emerald-600">{icon}</div>
                <span className="font-medium text-gray-600">{label}</span>
            </div>
            {renderValue()}
        </div>
    );
};

export default function PublicProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await api.get(`/users/${id}/`);
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                toast.error('Could not load user profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    if (loading) return <ProfileSkeleton />;
    if (!user) return <div className="py-10 text-center">Could not find user profile.</div>;

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-4xl py-8 px-4 sm:py-12">
                <div className="space-y-8">
                    {/* --- Colorful Header Card --- */}
                    <Card className="overflow-hidden shadow-xl">
                        <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-500 p-8 text-center text-white">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <Avatar className="mx-auto h-32 w-32 border-4 border-white shadow-lg">
                                <AvatarImage src={user.avatar_url} alt={user.username} />
                                <AvatarFallback className="text-4xl text-gray-700">
                                    {user.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight">{user.username}</h1>
                            {user.city && (
                                <p className="mt-1 flex items-center justify-center gap-1.5 text-emerald-50 opacity-90">
                                    <MapPin className="h-4 w-4" /> {user.city}
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* --- About Me Card --- */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                                <Smile className="text-emerald-600" /> About Me
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg leading-relaxed text-gray-700">{user.bio || 'No bio provided.'}</p>
                        </CardContent>
                    </Card>

                    {/* --- Lifestyle & Vitals Card --- */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                                <Home className="text-emerald-600" /> Lifestyle & Vitals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <ProfileTrait icon={<Briefcase />} label="Occupation" value={user.occupation} />
                            <ProfileTrait icon={<Users />} label="Gender Preference" value={user.gender_preference} />
                            <ProfileTrait icon={<Moon />} label="Sleep Schedule" value={user.sleep_schedule} />
                            <ProfileTrait icon={<Users />} label="Social Level" value={user.social_level} />
                            <ProfileTrait icon={<Utensils />} label="Cleanliness" value={user.cleanliness} />
                            <ProfileTrait icon={<Cigarette />} label="Smoker" value={user.smoking} />
                            <ProfileTrait icon={<Dog />} label="Has Pets" value={user.has_pets} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

// A dedicated skeleton loader for the new profile page design
const ProfileSkeleton = () => (
    <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:py-12">
            <div className="space-y-8">
                {/* Header Skeleton */}
                <Card className="overflow-hidden shadow-xl">
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-200 h-[280px]">
                        <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
                        <Skeleton className="mt-4 h-10 w-48" />
                        <Skeleton className="mt-2 h-5 w-32" />
                    </div>
                </Card>

                {/* Content Skeletons */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-40" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="mt-2 h-6 w-5/6" />
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-56" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </main>
);
