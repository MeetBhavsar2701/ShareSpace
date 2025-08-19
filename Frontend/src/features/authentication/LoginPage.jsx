import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        // Store both the access and the new refresh token
        sessionStorage.setItem("access_token", response.data.access);
        sessionStorage.setItem("refresh_token", response.data.refresh);
        sessionStorage.setItem("user_id", response.data.user_id);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("role", response.data.role);
        localStorage.setItem("role", response.data.role);
        
        navigate("/listings");
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
      console.error("Login failed:", err.response ? err.response.data : err);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Home className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back to Sharespace</h1>
            <p className="text-xl text-emerald-100">
              Connect with compatible roommates and find your perfect living space.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-stone-800">Sign In</CardTitle>
              <CardDescription className="text-stone-600">
                Welcome back! Please sign in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="Enter your username" 
                        className="pl-10 h-12 border-stone-300" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        className="pl-10 pr-10 h-12 border-stone-300" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-12 w-12" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center">
                <span className="text-stone-600">Don't have an account? </span>
                <Link to="/signup" className="text-emerald-600 hover:underline font-medium">Sign up</Link>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}