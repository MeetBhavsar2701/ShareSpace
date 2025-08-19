import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api"; // adjust path if needed

// ✅ Context with safe defaults (no destructuring errors)
const AuthContext = createContext({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user when provider mounts
  useEffect(() => {
    const fetchUser = async () => {
      // FIX: Check for token before making the API call
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get("/users/profile/update/"); // FIX: This URL is correct for GET requests
        setUser(res.data);
      } catch (err) {
        setUser(null);
        // Clear tokens on failure to ensure a clean state
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    // FIX: The logout endpoint might not exist, so let's log the user out on the frontend only for now
    try {
      // await api.post("/users/logout/");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      sessionStorage.clear();
      // Dispatch an event to update the header and other components
      window.dispatchEvent(new Event("storage"));
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/users/profile/update/"); // FIX: This URL is correct for GET requests
      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for easy access
export const useAuth = () => useContext(AuthContext);