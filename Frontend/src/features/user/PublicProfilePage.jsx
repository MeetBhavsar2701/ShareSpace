import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Briefcase, Smile, Moon, Users, Cigarette, Dog, Utensils } from 'lucide-react';

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start text-sm">
    <div className="flex-shrink-0 w-6 h-6 mr-3 text-emerald-600">{icon}</div>
    <div>
      <p className="font-semibold text-gray-500">{label}</p>
      <p className="text-gray-800">{value || 'Not specified'}</p>
    </div>
  </div>
);

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

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (!user) return <div className="text-center py-10">Could not find user profile.</div>;

  return (
    <main className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={user.avatar_url} alt={user.username} />
              <AvatarFallback className="text-3xl">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-3xl font-bold">{user.username}</CardTitle>
            <p className="text-muted-foreground">{user.city}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 mt-6">
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Smile /> About Me</h3>
            <p className="text-gray-700">{user.bio || 'No bio provided.'}</p>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Home /> Lifestyle & Habits</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
              <DetailItem icon={<Briefcase />} label="Occupation" value={user.occupation} />
              <DetailItem icon={<Moon />} label="Sleep Schedule" value={user.sleep_schedule} />
              <DetailItem icon={<Users />} label="Social Level" value={user.social_level} />
              <DetailItem icon={<Utensils />} label="Cleanliness" value={user.cleanliness} />
              <DetailItem icon={<Cigarette />} label="Smoking" value={user.smoking ? 'Yes' : 'No'} />
              <DetailItem icon={<Dog />} label="Has Pets" value={user.has_pets ? 'Yes' : 'No'} />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users /> Roommate Preferences</h3>
              <DetailItem label="Gender Preference" value={user.gender_preference} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}