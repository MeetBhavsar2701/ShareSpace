import { useEffect, useState, useCallback } from "react";
import api from "@/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "./components/ListingCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Filters } from "./components/Filters";
import debounce from 'lodash.debounce';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        pets_allowed: null,
        smoking_allowed: null,
        rent: [0, 100000],
    });

    const fetchListings = useCallback(debounce(async (currentFilters, currentSearch) => {
        setLoading(true);
        const params = new URLSearchParams();

        if (currentSearch) {
            params.append('search', currentSearch);
        }
        if (currentFilters.pets_allowed !== null) {
            params.append('pets_allowed', currentFilters.pets_allowed);
        }
        if (currentFilters.smoking_allowed !== null) {
            params.append('smoking_allowed', currentFilters.smoking_allowed);
        }
        params.append('min_rent', currentFilters.rent[0]);
        params.append('max_rent', currentFilters.rent[1]);

        try {
            const response = await api.get(`/listings/?${params.toString()}`);
            setListings(response.data);
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setLoading(false);
        }
    }, 300), []);

    useEffect(() => {
        fetchListings(filters, searchQuery);
    }, [filters, searchQuery, fetchListings]);

    const Controls = () => (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by city, address..."
                    className="pl-10 h-12 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Filters filters={filters} setFilters={setFilters} />
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <Controls />
                        </div>
                    </aside>
                    <div className="lg:hidden mb-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full h-12 text-lg">
                                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                                    Filters & Search
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
                                <Controls />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl animate-pulse"></div>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <h2 className="text-2xl font-semibold">No Listings Found</h2>
                                <p className="text-gray-600 mt-4">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}