import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api";
import { useAuth } from "@/features/authentication/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MapPicker } from "./components/MapPicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, UserPlus, Search } from "lucide-react";
import { CustomModal } from "@/components/CustomModal";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    description: "",
    pets_allowed: false,
    smoking_allowed: false,
    latitude: null,
    longitude: null,
    roommates_needed: 1,
    current_roommates: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      if (!user) return;
      try {
        const response = await api.get(`/listings/${id}/`);
        const data = response.data;

        if (data.lister.id !== user.id) {
          toast.error("You are not authorized to edit this listing.");
          navigate('/dashboard');
          return;
        }

        setFormData({
          title: data.title || "",
          address: data.address || "",
          city: data.city || "",
          rent: data.rent || "",
          description: data.description || "",
          pets_allowed: data.pets_allowed,
          smoking_allowed: data.smoking_allowed,
          latitude: data.latitude,
          longitude: data.longitude,
          roommates_needed: data.roommates_needed || 1,
          current_roommates: data.current_roommates_details || [],
        });

        setExistingImages(data.images || []);

      } catch (error) {
        toast.error("Failed to load listing details.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id, user, navigate]);

  useEffect(() => {
    if (!isModalOpen || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchUsers = async () => {
      setLoadingSearch(true);
      try {
        const response = await api.get(`/users/search/?q=${searchQuery}`);
        const addedRoommateIds = formData.current_roommates.map(r => r.id);
        setSearchResults(response.data.filter(user => !addedRoommateIds.includes(user.id)));
      } catch (error) {
        toast.error("Could not fetch users.");
      } finally {
        setLoadingSearch(false);
      }
    };
    const debounceTimer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, formData.current_roommates, isModalOpen]);
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSwitchChange = (name, checked) => setFormData({ ...formData, [name]: checked });
  const handleLocationSelect = (location) => setFormData({ ...formData, ...location });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setExistingImages([]);
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };
  
  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addRoommate = (user) => {
    setFormData(prev => ({ ...prev, current_roommates: [...prev.current_roommates, user] }));
    setSearchQuery("");
    setIsModalOpen(false);
  };

  const removeRoommate = (userId) => {
    setFormData(prev => ({ ...prev, current_roommates: prev.current_roommates.filter(r => r.id !== userId) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.latitude) {
      toast.error("Please select a location on the map.");
      return;
    }
    const submissionData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'current_roommates' && value !== null) {
        submissionData.append(key, value);
      }
    });

    formData.current_roommates.forEach(roommate => {
      submissionData.append('current_roommates', roommate.id);
    });
    
    imageFiles.forEach(file => {
      submissionData.append('images_data', file);
    });

    if (imageFiles.length === 0 && existingImages.length === 0) {
      toast.error("Please ensure there is at least one photo.");
      return;
    }

    try {
      await api.patch(`/listings/${id}/update/`, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Listing updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update listing.";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading Listing...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Your Listing</CardTitle>
            <CardDescription>Update the details about the space you're offering.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">Listing Title</Label>
                <Input id="title" name="title" value={formData.title} required onChange={handleChange} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-lg font-semibold">City</Label>
                  <Input id="city" name="city" value={formData.city} required onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-lg font-semibold">Monthly Rent (₹)</Label>
                  <Input id="rent" name="rent" type="number" value={formData.rent} required onChange={handleChange} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-lg font-semibold">Address</Label>
                <Input id="address" name="address" placeholder="Select a location on the map or enter manually" required value={formData.address} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                <Textarea id="description" name="description" value={formData.description} required onChange={handleChange} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="roommates_needed" className="text-lg font-semibold">Roommates Needed</Label>
                  <Input id="roommates_needed" name="roommates_needed" type="number" min="1" value={formData.roommates_needed} required onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Upload Photos</Label>
                  <Input type="file" onChange={handleImageChange} multiple />
                   <p className="text-sm text-gray-500">Uploading new photos will replace existing ones.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {existingImages.map((img, index) => (
                  <div key={img.image_url || index} className="relative group">
                    <img src={img.image_url} alt={`Existing ${index}`} className="h-24 w-full object-cover rounded-md" />
                  </div>
                ))}
                {imagePreviews.map((src, index) => (
                  <div key={src} className="relative group">
                    <img src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Current Roommates (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.current_roommates.map(user => (
                    <div key={user.id} className="flex items-center gap-2 bg-gray-100 rounded-full pl-2 pr-1 py-1">
                      <Avatar className="w-6 h-6"><AvatarImage src={user.avatar_url} /><AvatarFallback>{user.username.charAt(0)}</AvatarFallback></Avatar>
                      <span className="text-sm font-medium">{user.username}</span>
                      <button type="button" onClick={() => removeRoommate(user.id)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Roommate
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold">Location</Label>
                {formData.latitude && formData.longitude && (
                  <MapPicker 
                      onLocationSelect={handleLocationSelect} 
                      initialPosition={{ lat: formData.latitude, lng: formData.longitude }} 
                  />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="pets_allowed">Pets Allowed?</Label>
                  <Switch id="pets_allowed" checked={formData.pets_allowed} onCheckedChange={(checked) => handleSwitchChange("pets_allowed", checked)} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="smoking_allowed">Smoking Allowed?</Label>
                  <Switch id="smoking_allowed" checked={formData.smoking_allowed} onCheckedChange={(checked) => handleSwitchChange("smoking_allowed", checked)} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-emerald-500 hover:bg-emerald-600">Update Listing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a Roommate">
          {/* ... same as AddListingPage ... */}
      </CustomModal>
    </div>
  );
}