import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Home, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Seeker",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        city: "Not Set Yet",
      });

      if (response.status === 201) {
        sessionStorage.setItem("access_token", response.data.access);
        sessionStorage.setItem("refresh_token", response.data.refresh);
        sessionStorage.setItem("user_id", response.data.user_id);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("user_avatar", response.data.user_avatar);

        navigate("/onboarding");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Signup failed:", err.response ? err.response.data : err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <User className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
            <p className="text-xl text-emerald-100">
              Join our community to find compatible roommates and your ideal living space.
            </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-stone-800">Get Started</CardTitle>
              <CardDescription className="text-stone-600">Step 1 of 2: Create your account</CardDescription>
              <Progress value={50} className="mt-2" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Form fields remain the same */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="e.g., alexdoe" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="alex.doe@example.com" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="8+ characters" onChange={handleChange} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-500" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup defaultValue="Seeker" onValueChange={handleRoleChange} className="flex space-x-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Seeker" id="seeker" /><Label htmlFor="seeker">Room Seeker</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Lister" id="lister" /><Label htmlFor="lister">Room Lister</Label></div>
                  </RadioGroup>
                </div>
                {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
                <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
                    Next: Personality Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              <div className="text-center mt-6">
                <span className="text-stone-600">Already have an account? </span>
                <Link to="/login" className="text-emerald-600 hover:underline font-medium">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}