import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Heart, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-stone-800">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 to-white pt-24 pb-32 text-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
                        Find the Right Place, <br />
                        <span className="text-emerald-500">Share it with the Right People.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 text-balance">
                        ShareSpace uses smart matching to connect you with compatible people and amazing places. Your next chapter starts here.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-lg h-14 px-8">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link to="/listings">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-stone-300">
                                Browse Listings
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">How It Works</h2>
                    <p className="text-lg text-stone-600 mt-4 max-w-2xl mx-auto text-balance">Find your ideal living situation in three simple steps.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Take the Quiz</h3>
                        <p className="text-stone-600 text-balance">Our in-depth personality and lifestyle quiz helps us understand what you’re looking for.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">View Your Matches</h3>
                        <p className="text-stone-600 text-balance">Browse a personalized list of roommates and rooms with high compatibility scores.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Connect Securely</h3>
                        <p className="text-stone-600 text-balance">Chat with your matches, schedule viewings, and find your new home with confidence.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}