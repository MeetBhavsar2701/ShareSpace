import { useState, useEffect } from 'preact/hooks';
import { Map, Marker } from "pigeon-maps";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function MapPicker({ onLocationSelect, userCity }) {
  const [center, setCenter] = useState([23.0225, 72.5714]); // Default to Ahmedabad
  const [marker, setMarker] = useState(null);
  const [query, setQuery] = useState("");

  const geocodeCity = (city) => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCenter([lat, lon]);
        }
      });
  };

  // When the user's city from their profile is available, center the map there
  useEffect(() => {
    if (userCity) {
        setQuery(userCity);
        geocodeCity(userCity);
    }
  }, [userCity]);

  const handleMapClick = ({ latLng }) => {
    const [lat, lng] = latLng;
    setMarker([lat, lng]);
    onLocationSelect({ latitude: lat, longitude: lng });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      if (query) {
          geocodeCity(query);
      }
  };

  return (
    <div className="space-y-2">
       <div className="flex gap-2">
           <Input 
             placeholder="Search for an address or neighborhood..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
           <Button type="button" onClick={handleSearch}><Search className="h-4 w-4 mr-2" /> Search</Button>
       </div>
       <div className="h-64 w-full rounded-lg overflow-hidden border">
        <Map 
          center={center} 
          zoom={12} 
          onClick={handleMapClick}
        >
          {marker && <Marker 
            width={40} 
            anchor={marker} 
            color="#10B981" // Emerald color
          />}
        </Map>
      </div>
    </div>
  );
}