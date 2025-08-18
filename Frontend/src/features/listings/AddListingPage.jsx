import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MapPicker } from "./components/MapPicker";
import { X } from "lucide-react";

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
    longitude: null
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    // Pre-fill city from session storage if available
    const cityFromProfile = sessionStorage.getItem("user_city") || "";
    if (cityFromProfile) {
      setFormData(prev => ({ ...prev, city: cityFromProfile }));
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSwitchChange = (name, checked) => setFormData({ ...formData, [name]: checked });
  const handleLocationSelect = (location) => setFormData({ ...formData, ...location });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Use the name 'images_data' to match the backend serializer
    setImageFiles(prevFiles => [...prevFiles, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        submissionData.append(key, formData[key]);
      }
    }

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        // Use 'images_data' to match the serializer's write_only field
        submissionData.append('images_data', file);
      });
    } else {
      toast.error("Please upload at least one photo.");
      return;
    }

    try {
      await api.post("/listings/create/", submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Listing created successfully!");
      navigate("/listings");
    } catch (err) {
      console.error("Failed to create listing:", err.response ? err.response.data : err);
      if (err.response?.status !== 401) {
        toast.error("Failed to create listing. Please check your inputs.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-stone-800">Create a New Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">Listing Title</Label>
                <Input id="title" name="title" placeholder="e.g., Cozy Room in a Quiet Neighborhood" required onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-lg font-semibold">Street Address</Label>
                <Input id="address" name="address" placeholder="e.g., 15/B, Sunshine Apartments" required onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-lg font-semibold">City</Label>
                  <Input id="city" name="city" placeholder="e.g., Ahmedabad" required onChange={handleChange} value={formData.city} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-lg font-semibold">Monthly Rent (₹)</Label>
                  <Input id="rent" name="rent" type="number" placeholder="e.g., 15000" required onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe your space, amenities, and ideal roommate..." required onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold">Upload Photos</Label>
                <Input type="file" onChange={handleImageChange} multiple required className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold">Pinpoint Location</Label>
                <MapPicker onLocationSelect={handleLocationSelect} userCity={formData.city} />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">House Rules</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="pets_allowed">Pets Allowed?</Label>
                  <Switch id="pets_allowed" onCheckedChange={(checked) => handleSwitchChange("pets_allowed", checked)} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="smoking_allowed">Smoking Allowed?</Label>
                  <Switch id="smoking_allowed" onCheckedChange={(checked) => handleSwitchChange("smoking_allowed", checked)} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                  Submit Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}