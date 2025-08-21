import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "@/api"; // Assuming your api instance is configured
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, User, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ENHANCEMENT: Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/users/login/", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        sessionStorage.setItem("access_token", response.data.access);
        sessionStorage.setItem("refresh_token", response.data.refresh);
        sessionStorage.setItem("user_id", response.data.user_id);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("avatar_url", response.data.avatar_url);
        
        // This dispatches an event that the Header can listen to, forcing an update
        window.dispatchEvent(new Event("storage"));
        
        setAuthToken(response.data.access);
        navigate("/listings");
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* --- ENHANCED LEFT SIDE --- */}
      <div className="hidden lg:flex bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-white text-center space-y-6"
        >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold leading-tight">Welcome Back!</h1>
            <p className="text-xl text-green-100 max-w-sm mx-auto">
              Sign in to connect with roommates and find your next home.
            </p>
        </motion.div>
      </div>

      {/* --- ENHANCED RIGHT SIDE FORM --- */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-green-50/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-stone-800">Sign In</CardTitle>
              <CardDescription className="text-stone-600 pt-2">Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="username" type="text" placeholder="your_username" required className="pl-10 h-12" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {/* ENHANCEMENT: "Forgot Password?" link */}
                    <Link to="/forgot-password" tabIndex={-1} className="text-sm font-medium text-emerald-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="pl-10 pr-10 h-12" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4"/>
                    <span>{error}</span>
                  </div>
                )}
                
                <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30" size="lg" disabled={isLoading}>
                  {/* ENHANCEMENT: Loading spinner */}
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                </Button>
              </form>
              <div className="text-center mt-6">
                <span className="text-stone-600">Don't have an account? </span>
                <Link to="/signup" className="text-emerald-600 hover:underline font-semibold">Sign up for free</Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}