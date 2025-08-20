import { useState, useEffect } from 'react';
import api from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Info } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea'; // ADD THIS LINE

const mbtiTypes = [
  { value: 'INTJ', description: 'Imaginative and strategic thinkers, with a plan for everything.' },
  { value: 'INTP', description: 'Innovative inventors with an unquenchable thirst for knowledge.' },
  { value: 'ENTJ', description: 'Bold, imaginative and strong-willed leaders, always finding a way.' },
  { value: 'ENTP', description: 'Smart and curious thinkers who cannot resist an intellectual challenge.' },
  { value: 'INFJ', description: 'Quiet and mystical, yet very inspiring and tireless idealists.' },
  { value: 'INFP', description: 'Poetic, kind and altruistic people, always eager to help a good cause.' },
  { value: 'ENFJ', description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.' },
  { value: 'ENFP', description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.' },
  { value: 'ISTJ', description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.' },
  { value: 'ISFJ', description: 'Very dedicated and warm protectors, always ready to defend their loved ones.' },
  { value: 'ESTJ', description: 'Excellent administrators, unsurpassed at managing things or people.' },
  { value: 'ESFJ', description: 'Extraordinarily caring, social and popular people, always eager to help.' },
  { value: 'ISTP', description: 'Bold and practical experimenters, masters of all kinds of tools.' },
  { value: 'ISFP', description: 'Flexible and charming artists, always ready to explore and experience something new.' },
  { value: 'ESTP', description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.' },
  { value: 'ESFP', description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.' },
];


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    city: '',
    cleanliness: 3,
    sleep_schedule: 'Flexible',
    noise_level: 3,
    guest_frequency: 'Occasionally',
    social_level: 'Friendly but independent',
    smoking: 'Non-Smoker',
    has_pets: false,
    gender_preference: 'No Preference',
    work_schedule: '9-to-5',
    occupation: '',
    mbti_type: '',
    budget: 1000,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile/update/');
        setUser(response.data);
        setFormData({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            email: response.data.email || '',
            bio: response.data.bio || '',
            city: response.data.city || '',
            cleanliness: response.data.cleanliness || 3,
            sleep_schedule: response.data.sleep_schedule || 'Flexible',
            noise_level: response.data.noise_level || 3,
            guest_frequency: response.data.guest_frequency || 'Occasionally',
            social_level: response.data.social_level || 'Friendly but independent',
            smoking: response.data.smoking || 'Non-Smoker',
            has_pets: response.data.has_pets || false,
            gender_preference: response.data.gender_preference || 'No Preference',
            work_schedule: response.data.work_schedule || '9-to-5',
            occupation: response.data.occupation || '',
            mbti_type: response.data.mbti_type || '',
            budget: response.data.budget || 1000,
        });
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSwitchChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSubmit = new FormData();

    if (newAvatar) {
        dataToSubmit.append('avatar', newAvatar);
    }

    for (const key in formData) {
        if (key === 'mbti_type' && formData[key] === 'none') {
            dataToSubmit.append(key, '');
        } else {
            dataToSubmit.append(key, formData[key]);
        }
    }
    
    try {
      const response = await api.patch('/users/profile/update/', dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully!');
      const newAvatarUrl = response.data.avatar_url;
      setUser(response.data);
      if (newAvatarUrl) {
        setPreview(newAvatarUrl);
        sessionStorage.setItem('user_avatar', newAvatarUrl);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        </div>
    );
  }
  if (!user) return <div className="text-center py-10">Could not load profile.</div>

  return (
    <div className="min-h-screen bg-gray-50/50">
    <Toaster richColors position="top-center" />
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Edit Your Profile</CardTitle>
            <CardDescription>Keep your information up to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage src={preview} alt={user.username} />
                  <AvatarFallback className="text-4xl">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button asChild variant="link" className="text-emerald-600">
                    <Label htmlFor="avatar-upload">
                        Change Photo
                    </Label>
                </Button>
                <Input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>
              
              <Separator />

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Username</Label>
                        <Input value={user.username} disabled className="bg-gray-100"/>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleFormChange} />
                    </div>
                     <div>
                        <Label htmlFor="budget">Monthly Budget ($)</Label>
                        <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleFormChange} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="mbti_type">MBTI Type</Label>
                            <Popover>
                                <PopoverTrigger type="button" className="ml-2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                    <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-white">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-center">The 16 Personality Types</h4>
                                        <div className="text-xs text-gray-600 max-h-60 overflow-y-auto p-2 space-y-2">
                                            {mbtiTypes.map(type => (
                                                <p key={type.value}><strong>{type.value}:</strong> {type.description}</p>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Select name="mbti_type" value={formData.mbti_type} onValueChange={(value) => handleSelectChange('mbti_type', value)}>
                            <SelectTrigger><SelectValue placeholder="Select your type" /></SelectTrigger>
                            <SelectContent className="bg-white" position="popper">
                                <SelectItem value="none">Not Sure / Decline to Say</SelectItem>
                                {mbtiTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>{type.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* --- Add this new field for the bio --- */}
                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-lg font-semibold">About Me</Label>
                    <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio}
                        onChange={handleFormChange}
                        placeholder="Tell us a little about yourself, your hobbies, and what you're looking for in a roommate..." 
                    />
                </div>
              </div>

              <Separator />

              {/* Lifestyle Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Lifestyle & Habits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Cleanliness (1=Messy, 5=Neat)</Label>
                        <Input name="cleanliness" type="number" min="1" max="5" value={formData.cleanliness} onChange={handleFormChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Noise Level (1=Quiet, 5=Lively)</Label>
                        <Input name="noise_level" type="number" min="1" max="5" value={formData.noise_level} onChange={handleFormChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Sleep Schedule</Label>
                        <Select name="sleep_schedule" value={formData.sleep_schedule} onValueChange={(value) => handleSelectChange('sleep_schedule', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="Early Bird">Early Bird</SelectItem><SelectItem value="Night Owl">Night Owl</SelectItem><SelectItem value="Flexible">Flexible</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Guest Frequency</Label>
                        <Select name="guest_frequency" value={formData.guest_frequency} onValueChange={(value) => handleSelectChange('guest_frequency', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="Rarely">Rarely</SelectItem><SelectItem value="Occasionally">Occasionally</SelectItem><SelectItem value="Frequently">Frequently</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Social Style</Label>
                        <Select name="social_level" value={formData.social_level} onValueChange={(value) => handleSelectChange('social_level', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="Very social">Very social</SelectItem><SelectItem value="Friendly but independent">Friendly but independent</SelectItem><SelectItem value="Keeps to self">Keeps to self</SelectItem></SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Smoking</Label>
                        <Select name="smoking" value={formData.smoking} onValueChange={(value) => handleSelectChange('smoking', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="Smoker">Smoker</SelectItem><SelectItem value="Non-Smoker">Non-Smoker</SelectItem><SelectItem value="Outside only">Outside only</SelectItem></SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center justify-between pt-4 col-span-1 md:col-span-2">
                        <Label htmlFor="has_pets" className="text-base">Do you have pets?</Label>
                        <Switch id="has_pets" checked={formData.has_pets} onCheckedChange={(value) => handleSwitchChange('has_pets', value)} />
                    </div>
                </div>
              </div>

              <Separator />

              {/* Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Roommate Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Gender Preference</Label>
                        <Select name="gender_preference" value={formData.gender_preference} onValueChange={(value) => handleSelectChange('gender_preference', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="No Preference">No Preference</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Preferred Work Schedule</Label>
                        <Select name="work_schedule" value={formData.work_schedule} onValueChange={(value) => handleSelectChange('work_schedule', value)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-white" position="popper"><SelectItem value="9-to-5">9-to-5</SelectItem><SelectItem value="Flexible Hours">Flexible Hours</SelectItem><SelectItem value="Night Shifts">Night Shifts</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}