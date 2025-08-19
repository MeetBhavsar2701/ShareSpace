import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/features/authentication/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPicker } from "./components/MapPicker"; // Corrected import
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    rent: "",
    deposit: "",
    lease_duration: "",
    roommates_needed: "",
    roommates_found: "",
    apartment_type: "",
    amenities: "",
    pets_allowed: false,
    smoking_allowed: false,
    latitude: null,
    longitude: null,
    images: [],
    existing_images: [],
  });
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      if (!user) return;

      try {
        const response = await api.get(`/listings/${id}/`);
        const listingData = response.data;

        if (listingData.lister.id !== user.id) {
          toast.error("You are not authorized to edit this listing.");
          navigate('/dashboard');
          return;
        }

        setFormData({
          title: listingData.title,
          description: listingData.description,
          city: listingData.city,
          address: listingData.address,
          rent: listingData.rent,
          deposit: listingData.deposit,
          lease_duration: listingData.lease_duration,
          roommates_needed: listingData.roommates_needed,
          roommates_found: listingData.roommates_found,
          apartment_type: listingData.apartment_type,
          amenities: listingData.amenities,
          pets_allowed: listingData.pets_allowed,
          smoking_allowed: listingData.smoking_allowed,
          latitude: listingData.latitude,
          longitude: listingData.longitude,
          images: [],
          existing_images: listingData.images,
        });
        setMapPosition({ lat: listingData.latitude, lng: listingData.longitude });
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to load listing.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleMapChange = (position, address) => {
    setMapPosition(position);
    setFormData((prev) => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng,
      address: address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach((image) => {
          data.append('images', image);
        });
      } else if (key !== 'id' && key !== 'existing_images') {
        data.append(key, formData[key]);
      }
    }

    try {
      await api.patch(`/listings/${id}/update/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Listing updated successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing. Please check your data.");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading listing details...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          <CardDescription>
            Update the details for your listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Spacious 2BHK in Downtown"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., New York"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your property and the roommates you are looking for."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rent">Rent (per month)</Label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Security Deposit</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.deposit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lease_duration">Lease Duration (months)</Label>
                <Input
                  id="lease_duration"
                  name="lease_duration"
                  type="number"
                  placeholder="e.g., 12"
                  value={formData.lease_duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roommates_needed">Roommates Needed</Label>
                <Input
                  id="roommates_needed"
                  name="roommates_needed"
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.roommates_needed}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apartment_type">Apartment Type</Label>
              <Select
                id="apartment_type"
                name="apartment_type"
                value={formData.apartment_type}
                onValueChange={(value) => handleSelectChange('apartment_type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an apartment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1BHK">1BHK</SelectItem>
                  <SelectItem value="2BHK">2BHK</SelectItem>
                  <SelectItem value="3BHK">3BHK</SelectItem>
                  <SelectItem value="4BHK">4BHK</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Images</Label>
              <Carousel className="w-full">
                <CarouselContent>
                  {formData.existing_images.map((img, index) => (
                    <CarouselItem key={index}>
                      <img src={img.image} alt={`Listing image ${index + 1}`} className="w-full h-auto object-cover rounded-md" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Upload New Images</Label>
              <Input
                id="images"
                name="images"
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pets_allowed"
                  name="pets_allowed"
                  checked={formData.pets_allowed}
                  onCheckedChange={(checked) => handleSelectChange('pets_allowed', checked)}
                />
                <Label htmlFor="pets_allowed">Pets Allowed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smoking_allowed"
                  name="smoking_allowed"
                  checked={formData.smoking_allowed}
                  onCheckedChange={(checked) => handleSelectChange('smoking_allowed', checked)}
                />
                <Label htmlFor="smoking_allowed">Smoking Allowed</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <p className="text-sm text-gray-500">
                {formData.address || 'Select a location on the map to get the address.'}
              </p>
              <MapPicker
                onSelectLocation={handleMapChange}
                initialPosition={mapPosition}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Update Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}