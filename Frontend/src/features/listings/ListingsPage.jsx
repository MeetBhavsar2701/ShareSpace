import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { Filters } from "@/features/listings/components/Filters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const mockListings = [
  { id: 1, title: 'Sunny Downtown Loft', location: 'Urban Core, Metro City', price: 1200, match: 92, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
  { id: 2, title: 'Quiet Garden Apartment', location: 'Suburbia, Metro City', price: 850, match: 88, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
  { id: 3, title: 'Artistic Warehouse Space', location: 'Arts District, Metro City', price: 1100, match: 85, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' },
  { id: 4, title: 'Modern High-Rise Condo', location: 'Financial District', price: 1500, match: 78, image: 'https://images.unsplash.com/photo-1560185893-a55de8537e49' },
  // Add 4 more for a full grid
  { id: 5, title: 'Charming Victorian Flat', location: 'Historic Quarter', price: 950, match: 95, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
  { id: 6, title: 'Cozy Studio near Campus', location: 'University Heights', price: 700, match: 89, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' },
  { id: 7, title: 'Riverside Retreat', location: 'Waterfront District', price: 1300, match: 82, image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c' },
  { id: 8, title: 'Minimalist Rooftop Pad', location: 'North End', price: 1400, match: 75, image: 'https://images.unsplash.com/photo-1613553423778-61821b44feb9' },
];

export default function ListingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Stays in Metro City</h1>
          <Filters />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
      <Footer />
    </div>
  );
}