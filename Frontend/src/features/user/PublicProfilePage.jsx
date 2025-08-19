import { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { api } from '../../api';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    city: '',
    budget: 0,
    cleanliness: '',
    noise_level: '',
    sleep_schedule: '',
    smoking: false,
    social_level: '',
    has_pets: false,
    gender_preference: '',
    work_schedule: '',
    occupation: '',
    mbti_type: '',
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        bio: user.bio || '',
        city: user.city || '',
        budget: user.budget || 0,
        cleanliness: user.cleanliness || '',
        noise_level: user.noise_level || '',
        sleep_schedule: user.sleep_schedule || '',
        smoking: user.smoking || false,
        social_level: user.social_level || '',
        has_pets: user.has_pets || false,
        gender_preference: user.gender_preference || '',
        work_schedule: user.work_schedule || '',
        occupation: user.occupation || '',
        mbti_type: user.mbti_type || '',
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: e.target.files[0],
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    data.append('city', formData.city);
    data.append('budget', formData.budget);
    data.append('cleanliness', formData.cleanliness);
    data.append('noise_level', formData.noise_level);
    data.append('sleep_schedule', formData.sleep_schedule);
    data.append('smoking', formData.smoking);
    data.append('social_level', formData.social_level);
    data.append('has_pets', formData.has_pets);
    data.append('gender_preference', formData.gender_preference);
    data.append('work_schedule', formData.work_schedule);
    data.append('occupation', formData.occupation);
    data.append('mbti_type', formData.mbti_type);
    if (formData.avatar instanceof File) {
      data.append('avatar', formData.avatar);
    }
  
    try {
      await api.patch('/users/profile/update/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refreshUser();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile.');
    }
  };
  

  const renderProfileField = (label, value) => (
    <div className="flex flex-col space-y-1">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <p className="text-base">{value || 'Not set'}</p>
    </div>
  );

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{isEditing ? 'Edit Profile' : 'User Profile'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update your personal information.' : 'View your personal information.'}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input id="avatar" type="file" name="avatar" onChange={handleFileChange} />
                {formData.avatar && typeof formData.avatar === 'string' && (
                  <img src={formData.avatar} alt="Current Avatar" className="w-24 h-24 rounded-full object-cover" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cleanliness">Cleanliness</Label>
                  <Select name="cleanliness" value={formData.cleanliness} onValueChange={(value) => handleSelectChange('cleanliness', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cleanliness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tidy">Tidy</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Messy">Messy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="noise_level">Noise Level</Label>
                  <Select name="noise_level" value={formData.noise_level} onValueChange={(value) => handleSelectChange('noise_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a noise level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quiet">Quiet</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Loud">Loud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smoking"
                  name="smoking"
                  checked={formData.smoking}
                  onCheckedChange={(checked) => handleSelectChange('smoking', checked)}
                />
                <Label htmlFor="smoking">Smoking Allowed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_pets"
                  name="has_pets"
                  checked={formData.has_pets}
                  onCheckedChange={(checked) => handleSelectChange('has_pets', checked)}
                />
                <Label htmlFor="has_pets">Has Pets</Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="social_level">Social Level</Label>
                <Select name="social_level" value={formData.social_level} onValueChange={(value) => handleSelectChange('social_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select social level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Keep to self">Keep to self</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Very social / Friends">Very social / Friends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="gender_preference">Gender Preference</Label>
                <Select name="gender_preference" value={formData.gender_preference} onValueChange={(value) => handleSelectChange('gender_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="No Preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="work_schedule">Work Schedule</Label>
                <Select name="work_schedule" value={formData.work_schedule} onValueChange={(value) => handleSelectChange('work_schedule', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a work schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote / WFH">Remote / WFH</SelectItem>
                    <SelectItem value="Shift Work">Shift Work</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="occupation">Occupation</Label>
                <Select name="occupation" value={formData.occupation} onValueChange={(value) => handleSelectChange('occupation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mbti_type">MBTI Type</Label>
                <Select name="mbti_type" value={formData.mbti_type} onValueChange={(value) => handleSelectChange('mbti_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select MBTI type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENFP">ENFP</SelectItem>
                    <SelectItem value="ENTJ">ENTJ</SelectItem>
                    <SelectItem value="ENTP">ENTP</SelectItem>
                    <SelectItem value="ESFJ">ESFJ</SelectItem>
                    <SelectItem value="ESFP">ESFP</SelectItem>
                    <SelectItem value="ESTJ">ESTJ</SelectItem>
                    <SelectItem value="ESTP">ESTP</SelectItem>
                    <SelectItem value="INFJ">INFJ</SelectItem>
                    <SelectItem value="INFP">INFP</SelectItem>
                    <SelectItem value="INTJ">INTJ</SelectItem>
                    <SelectItem value="INTP">INTP</SelectItem>
                    <SelectItem value="ISFJ">ISFJ</SelectItem>
                    <SelectItem value="ISFP">ISFP</SelectItem>
                    <SelectItem value="ISTJ">ISTJ</SelectItem>
                    <SelectItem value="ISTP">ISTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <img src={user?.avatar} alt="Profile Avatar" className="w-32 h-32 rounded-full object-cover" />
                {renderProfileField('Name', `${user?.first_name} ${user?.last_name}`)}
                {renderProfileField('Email', user?.email)}
                {renderProfileField('Bio', user?.bio)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderProfileField('City', user?.city)}
                {renderProfileField('Budget', user?.budget)}
                {renderProfileField('Cleanliness', user?.cleanliness)}
                {renderProfileField('Noise Level', user?.noise_level)}
                {renderProfileField('Sleep Schedule', user?.sleep_schedule)}
                {renderProfileField('Smoking', user?.smoking ? 'Yes' : 'No')}
                {renderProfileField('Social Level', user?.social_level)}
                {renderProfileField('Has Pets', user?.has_pets ? 'Yes' : 'No')}
                {renderProfileField('Gender Preference', user?.gender_preference)}
                {renderProfileField('Work Schedule', user?.work_schedule)}
                {renderProfileField('Occupation', user?.occupation)}
                {renderProfileField('MBTI Type', user?.mbti_type)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;