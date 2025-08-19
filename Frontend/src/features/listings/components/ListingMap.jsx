import { Map, Marker } from "pigeon-maps";

export function ListingMap({ listings }) {
  // Default center to Ahmedabad if no listings are available
  const defaultCenter = [23.0225, 72.5714];
  const center = listings.length > 0 && listings[0].latitude && listings[0].longitude
    ? [listings[0].latitude, listings[0].longitude]
    : defaultCenter;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border">
      <Map center={center} defaultZoom={11}>
        {listings.map(listing => 
          (listing.latitude && listing.longitude) && (
            <Marker 
              key={listing.id}
              width={40} 
              anchor={[listing.latitude, listing.longitude]}
              color="#10B981" // Emerald color
            />
          )
        )}
      </Map>
    </div>
  );
}