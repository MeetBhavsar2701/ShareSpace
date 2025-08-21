import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Heart, Shield, Search, MessageSquare, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import filterSS from '@/assets/filter.png';
import chatSS from '@/assets/chat.png';
import pic from '@/assets/pic.avif';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-stone-800">
      <Header />
      <main className="flex-grow">
        
        {/* --- HERO SECTION (VIBRANT & DYNAMIC) --- */}
        <section className="relative text-white overflow-hidden bg-emerald-500">
          {/* ENHANCEMENT: Bold gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-emerald-700 to-slate-900" />
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-center md:text-left"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-balance" style={{textShadow: '0 2px 10px rgba(0,0,0,0.2)'}}>
                  Find Your Place.
                  <br />
                  Discover Your People.
                </h1>
                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-emerald-100 text-balance">
                  ShareSpace uses smart matching to connect you with compatible people and amazing places. Your next chapter starts here.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-200 text-emerald-600 text-lg h-14 px-8 shadow-2xl font-bold transition-all duration-300 transform hover:scale-105">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="mt-12 md:mt-0"
              >
                {/* ENHANCEMENT: Engaging GIF from the internet */}
                <img 
                  src={pic} 
                  className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION (Soft Gradient) --- */}
        <motion.section 
          className="py-24 bg-gradient-to-b from-white to-emerald-50"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight">Everything You Need for a Perfect Match</h2>
              <p className="text-lg text-stone-600 mt-4 max-w-3xl mx-auto text-balance">Our platform is designed to make your search simple, safe, and successful.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"><Search className="w-6 h-6 text-emerald-600" /></div><h3 className="text-2xl font-semibold">Advanced Search Filters</h3></div>
                <p className="text-stone-600 pl-16">Zero in on your perfect space with detailed filters for price, amenities, location, and even house rules. Find exactly what you're looking for, faster.</p>
              </div>
              {/* ENHANCEMENT: Glowing shadow on screenshots */}
              <div className="p-2 rounded-xl shadow-[0_10px_40px_-10px_rgba(22,163,74,0.3)] bg-white">
                <img src={filterSS} alt="Screenshot of search UI" className="rounded-lg" />
              </div>
              <div className="p-2 rounded-xl shadow-[0_10px_40px_-10px_rgba(22,163,74,0.3)] bg-white md:order-last">
                <img src={chatSS} alt="Screenshot of chat UI" className="rounded-lg"/>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"><MessageSquare className="w-6 h-6 text-emerald-600" /></div><h3 className="text-2xl font-semibold">Secure In-App Messaging</h3></div>
                <p className="text-stone-600 pl-16">Chat with potential roommates without sharing personal contact information. Our secure messaging system keeps your privacy protected.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- HOW IT WORKS (DARK MODE SECTION) --- */}
        <motion.section 
          className="py-24 bg-slate-900 text-white"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight">Find Your Fit in 3 Simple Steps</h2>
              <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto text-balance">Our streamlined process takes the stress out of finding the perfect living situation.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Users className="w-8 h-8 text-emerald-400" /><span className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center font-bold text-white bg-emerald-500 rounded-full border-2 border-slate-900">1</span></div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-slate-400 text-balance">Answer our in-depth quiz to help us understand exactly what you’re looking for.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Heart className="w-8 h-8 text-emerald-400" /><span className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center font-bold text-white bg-emerald-500 rounded-full border-2 border-slate-900">2</span></div>
                <h3 className="text-xl font-semibold mb-2">View Your Matches</h3>
                <p className="text-slate-400 text-balance">Browse a personalized list of roommates and rooms with high compatibility scores.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Shield className="w-8 h-8 text-emerald-400" /><span className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center font-bold text-white bg-emerald-500 rounded-full border-2 border-slate-900">3</span></div>
                <h3 className="text-xl font-semibold mb-2">Connect Securely</h3>
                <p className="text-slate-400 text-balance">Chat with matches, schedule viewings, and sign agreements with confidence.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- TESTIMONIALS SECTION --- */}
        <motion.section 
          className="py-24 bg-white"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight">Loved by People Like You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl border relative">
                <Quote className="absolute top-4 left-4 w-12 h-12 text-emerald-100" />
                <p className="text-stone-600 mb-6 z-10 relative">"ShareSpace made finding a roommate a breeze! The compatibility score was spot on. I found a great place and a new friend."</p>
                <div className="flex items-center gap-4"><Avatar><AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /><AvatarFallback>SA</AvatarFallback></Avatar><div><p className="font-semibold">Sarah A.</p><p className="text-sm text-stone-500">Software Developer</p></div></div>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border relative">
                 <Quote className="absolute top-4 left-4 w-12 h-12 text-emerald-100" />
                <p className="text-stone-600 mb-6 z-10 relative">"As a lister, I was impressed with the quality of applicants. The platform's verification features gave me peace of mind."</p>
                <div className="flex items-center gap-4"><Avatar><AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" /><AvatarFallback>MJ</AvatarFallback></Avatar><div><p className="font-semibold">Michael J.</p><p className="text-sm text-stone-500">Property Owner</p></div></div>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border relative">
                 <Quote className="absolute top-4 left-4 w-12 h-12 text-emerald-100" />
                <p className="text-stone-600 mb-6 z-10 relative">"Moving to a new city was daunting, but I found my new home and community through ShareSpace. Highly recommend!"</p>
                <div className="flex items-center gap-4"><Avatar><AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704f" /><AvatarFallback>CE</AvatarFallback></Avatar><div><p className="font-semibold">Chloe E.</p><p className="text-sm text-stone-500">Graduate Student</p></div></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- FINAL CTA SECTION --- */}
        <motion.section 
          className="py-24 bg-gradient-to-r from-emerald-500 to-green-400 text-white"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Find Your Space?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-emerald-100 text-balance">Create your profile today and start matching with compatible people and places in minutes.</p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-emerald-600 text-lg h-14 px-8 shadow-2xl font-bold transform hover:scale-105 transition-transform">
                  Join ShareSpace Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}