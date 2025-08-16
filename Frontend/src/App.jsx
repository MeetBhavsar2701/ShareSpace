import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './features/LandingPage'; // We will create this next
import LoginPage from './features/authentication/LoginPage';
import SignupPage from './features/authentication/SignupPage';
import ListingsPage from './features/listings/ListingsPage';
import ListingDetailsPage from './features/listings/ListingDetailsPage';
import MessagesPage from './features/chat/MessagesPage';
import ProfilePage from './features/user/ProfilePage';
import DashboardPage from './features/user/DashboardPage';

// You can add these pages later
// import OnboardingPage from './features/onboarding/OnboardingPage';
// import MatchesPage from './features/matches/MatchesPage';
// import AddListingPage from './features/listings/AddListingPage';
// import HelpPage from './features/help/HelpPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Add routes for other pages as you build them */}
        {/* <Route path="/onboarding" element={<OnboardingPage />} /> */}
        {/* <Route path="/matches" element={<MatchesPage />} /> */}
        {/* <Route path="/add-listing" element={<AddListingPage />} /> */}
        {/* <Route path="/help" element={<HelpPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}