import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './features/LandingPage';
import LoginPage from './features/authentication/LoginPage';
import SignupPage from './features/authentication/SignupPage';
import OnboardingPage from './features/onboarding/OnboardingPage';
import ListingsPage from './features/listings/ListingsPage';
import ListingDetailsPage from './features/listings/ListingDetailsPage';
import AddListingPage from './features/listings/AddListingPage';
import MessagesPage from './features/chat/MessagesPage';
import ProfilePage from './features/user/ProfilePage';
import DashboardPage from './features/user/DashboardPage';
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}