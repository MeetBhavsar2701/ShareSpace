import { useState, useEffect } from 'react';
import api from '@/api';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile/update/'); 
        setUser(response.data);
        setPreview(response.data.avatar_url);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAvatar) {
        toast.info("No new photo selected.");
        return;
    }
    const formData = new FormData();
    formData.append('avatar', newAvatar);
    
    try {
      const response = await api.patch('/users/profile/update/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully!');
      const newAvatarUrl = response.data.avatar_url;
      setUser(response.data);
      setPreview(newAvatarUrl);
      // FIX: Update sessionStorage so the header updates instantly
      sessionStorage.setItem('user_avatar', newAvatarUrl);
      // Force re-render of components using this session data by navigating
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Could not load profile.</div>

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={preview} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="cursor-pointer text-emerald-600 hover:underline">
                  Change Photo
                </Label>
                <Input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>

              <div>
                <Label>Username</Label>
                <Input value={user.username} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>

              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}