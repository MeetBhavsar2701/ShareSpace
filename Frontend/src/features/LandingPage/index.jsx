import { useState } from "react";
import { Link } from "react-router-dom"; // Use from react-router-dom
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Search, Heart, Shield, Star, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

// Navigation Component (adapted from reference)
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-stone-800">Sharespace</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-stone-600 hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-stone-600 hover:text-emerald-600 transition-colors">Reviews</a>
            <Link to="/login" className="text-stone-600 hover:text-emerald-600 transition-colors">Login</Link>
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200">
          <div className="px-4 py-2 space-y-2">
            <a href="#how-it-works" className="block py-2 text-stone-600">How It Works</a>
            <a href="#testimonials" className="block py-2 text-stone-600">Reviews</a>
            <Link to="/login" className="block py-2 text-stone-600">Login</Link>
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graduate Student",
      content: "Found my perfect roommate in just 2 weeks! Our 95% compatibility score was spot on - we both love quiet study time and cooking together.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      content: "The personality matching is incredible. I was matched with someone who shares my love for early morning workouts and clean living spaces.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-stone-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-stone-800 mb-6">
                Find the right place. <span className="text-emerald-600">Share it with the right people.</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8 max-w-2xl">
                Connect with compatible roommates through personality-based matching. No more awkward living situations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-3">
                  <Link to="/listings"><Search className="w-5 h-5 mr-2" /> Find a Room</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent">
                  <Link to="/add-listing"><Home className="w-5 h-5 mr-2" /> Post a Listing</Link>
                </Button>
              </div>
            </div>
            {/* ... other sections ... */}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-stone-100">
        {/* ... content ... */}
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 lg:py-24 bg-white">
        {/* ... content ... */}
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12">
        {/* ... content ... */}
      </footer>
    </div>
  );
}