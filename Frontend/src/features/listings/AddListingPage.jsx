import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
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
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomModal } from "@/components/CustomModal"; // Import the new modal

export default function AddListingPage() {
  const navigate = useNavigate();
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
    current_roommates: [], // Holds full user objects for display
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

  // Auto-fill city from user's profile
  useEffect(() => {
    const cityFromProfile = sessionStorage.getItem("user_city");
    if (cityFromProfile) {
      setFormData(prev => ({ ...prev, city: cityFromProfile }));
    }
  }, []);

  // Debounced user search for roommates
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
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addRoommate = (user) => {
    setFormData(prev => ({ ...prev, current_roommates: [...prev.current_roommates, user] }));
    setSearchQuery("");
    setIsModalOpen(false); // Close modal after adding
  };

  const removeRoommate = (userId) => {
    setFormData(prev => ({ ...prev, current_roommates: prev.current_roommates.filter(r => r.id !== userId) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }

    try {
      await api.post("/listings/create/", submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Listing created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to create listing. Please check your inputs.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create a New Listing</CardTitle>
            <CardDescription>Fill in the details about the space you're offering.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* --- Listing Details --- */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">Listing Title</Label>
                <Input id="title" name="title" placeholder="e.g., Cozy Room in a Quiet Neighborhood" required onChange={handleChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-lg font-semibold">City</Label>
                  <Input id="city" name="city" placeholder="e.g., Ahmedabad" required value={formData.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-lg font-semibold">Monthly Rent (₹)</Label>
                  <Input id="rent" name="rent" type="number" placeholder="e.g., 15000" required onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe the space, amenities, and your ideal roommate..." required onChange={handleChange} />
              </div>

              {/* --- Roommate & Photos --- */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="roommates_needed" className="text-lg font-semibold">Roommates Needed</Label>
                  <Input id="roommates_needed" name="roommates_needed" type="number" min="1" value={formData.roommates_needed} required onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Upload Photos</Label>
                  <Input type="file" onChange={handleImageChange} multiple required />
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* --- Current Roommates (Using Custom Modal) --- */}
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

              {/* --- Location & Rules --- */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Location</Label>
                <MapPicker onLocationSelect={handleLocationSelect} userCity={formData.city} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg"><Label htmlFor="pets_allowed">Pets Allowed?</Label><Switch id="pets_allowed" onCheckedChange={(checked) => handleSwitchChange("pets_allowed", checked)} /></div>
                <div className="flex items-center justify-between p-4 border rounded-lg"><Label htmlFor="smoking_allowed">Smoking Allowed?</Label><Switch id="smoking_allowed" onCheckedChange={(checked) => handleSwitchChange("smoking_allowed", checked)} /></div>
              </div>

              {/* --- Submit --- */}
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-emerald-500 hover:bg-emerald-600">Submit Listing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* --- Render the Modal --- */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a Roommate">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loadingSearch && <p className="p-2 text-sm text-center">Searching...</p>}
            {!loadingSearch && searchResults.length === 0 && searchQuery.length > 1 && <p className="p-2 text-sm text-center">No users found.</p>}
            {searchResults.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                onClick={() => addRoommate(user)}
              >
                <Avatar className="w-8 h-8"><AvatarImage src={user.avatar_url} /><AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      </CustomModal>
    </div>
  );
}