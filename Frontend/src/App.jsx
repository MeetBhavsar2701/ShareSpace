import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/authentication/AuthContext";
import { MainLayout } from "./components/MainLayout";
import LoginPage from "./features/authentication/LoginPage";
import SignupPage from "./features/authentication/SignupPage";
import OnboardingPage from "./features/onboarding/OnboardingPage";
import ListingsPage from "./features/listings/ListingsPage";
import ListingDetailsPage from "./features/listings/ListingDetailsPage";
import AddListingPage from "./features/listings/AddListingPage";
import EditListingPage from "./features/listings/EditListingPage";
import ProfilePage from "./features/user/ProfilePage";
import PublicProfilePage from "./features/user/PublicProfilePage";
import FavoritesPage from "./features/user/FavoritesPage";
import MatchesPage from "./features/user/MatchesPage";
import DashboardPage from "./features/user/DashboardPage";
import MessagesPage from "./features/chat/MessagesPage";
import LandingPage from "./features/LandingPage";
import HelpCenterPage from "./features/info/HelpCenterPage";
import TermsOfServicePage from "./features/info/TermsOfServicePage";
import PrivacyPolicyPage from "./features/info/PrivacyPolicyPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes that use the main layout */}
          <Route element={<MainLayout />}>
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route path="/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<PublicProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/add-listing"element={<AddListingPage />}/>
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Route>
          
          {/* Standalone routes without the main layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;