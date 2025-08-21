import { useEffect, useState, useMemo } from "react";
import api from "@/api";
import { ListingCard } from "./components/ListingCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, SearchX } from "lucide-react";
import { Filters } from "./components/Filters";
import debounce from 'lodash.debounce';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import 'leaflet/dist/leaflet.css';

// --- Enhanced Controls with a title ---
const ListingControls = ({ searchQuery, setSearchQuery, filters, setFilters }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-stone-800">Filters & Search</h2>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search by city, address..."
        className="pl-10 h-12 text-lg focus-visible:ring-emerald-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <Filters filters={filters} setFilters={setFilters} />
  </div>
);

// --- Animation variants for the grid ---
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const gridItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};


export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        pets_allowed: null,
        smoking_allowed: null,
        rent: [0, 100000],
    });

    const debouncedFetch = useMemo(
        () => debounce(async (currentFilters, currentSearch, signal) => {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentSearch) params.append('search', currentSearch);
            if (currentFilters.pets_allowed !== null) params.append('pets_allowed', currentFilters.pets_allowed);
            if (currentFilters.smoking_allowed !== null) params.append('smoking_allowed', currentFilters.smoking_allowed);
            params.append('min_rent', currentFilters.rent[0]);
            params.append('max_rent', currentFilters.rent[1]);

            try {
                const response = await api.get(`/listings/?${params.toString()}`, { signal });
                setListings(response.data);
            } catch (error) {
                if (error.name !== 'AbortError') console.error("Failed to fetch listings", error);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        debouncedFetch(filters, searchQuery, controller.signal);
        return () => controller.abort();
    }, [filters, searchQuery, debouncedFetch]);
    
    const clearFilters = () => {
        setSearchQuery('');
        setFilters({
            pets_allowed: null,
            smoking_allowed: null,
            rent: [0, 100000],
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative">
            {/* ENHANCEMENT: Subtle dot pattern for the entire page background */}
            <div 
              className="absolute inset-0 -z-10 h-full w-full" 
              style={{
                backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                backgroundSize: '1.5rem 1.5rem'
              }}
            />
            <main className="flex-grow container mx-auto py-8 px-4">
                {/* ENHANCEMENT: New Page Header */}
                <section className="p-8 mb-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800">Find Your Next Home</h1>
                        <p className="text-stone-600 mt-2">Browse listings tailored to your preferences.</p>
                    </div>
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="h-12 text-lg bg-white/70">
                                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 bg-white">
                                <ListingControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} />
                            </SheetContent>
                        </Sheet>
                    </div>
                </section>

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* ENHANCEMENT: Styled aside panel */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border">
                           <ListingControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} />
                        </div>
                    </aside>
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl animate-pulse"></div>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : listings.length > 0 ? (
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                variants={gridContainerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {listings.map((listing) => (
                                    <motion.div key={listing.id} variants={gridItemVariants}>
                                        <ListingCard listing={listing} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            // ENHANCEMENT: Improved "No Results" state
                            <div className="text-center py-16 bg-white rounded-2xl border shadow-md">
                                <SearchX className="mx-auto h-16 w-16 text-gray-300" />
                                <h2 className="mt-6 text-2xl font-semibold text-stone-800">No Listings Found</h2>
                                <p className="text-gray-600 mt-2">Your search and filter combination didn't return any results.</p>
                                <Button onClick={clearFilters} className="mt-6 bg-emerald-500 hover:bg-emerald-600">
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}