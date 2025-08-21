import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Home, User, Mail, Lock, Eye, EyeOff, ArrowRight, Search } from "lucide-react";

// NOTE: Removed react-icons to adhere to the green-only theme.

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Seeker",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/users/register/", formData);

      if (response.status === 201) {
        navigate("/onboarding", { state: { userId: response.data.user_id } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* --- GREEN-THEMED LEFT SIDE --- */}
      {/* COLOR: Gradient is now exclusively shades of green */}
      <div className="hidden lg:flex bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Bubbles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
        
        <div className="relative z-10 text-white text-center space-y-6 backdrop-blur-sm bg-black/10 p-10 rounded-xl border border-white/20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold leading-tight">Welcome to ShareSpace</h1>
            <p className="text-xl text-green-100 max-w-sm mx-auto">
              Join a community of renters and listers finding their perfect match.
            </p>
            <div className="pt-6 border-t border-white/20">
                <p className="text-lg italic text-white/80">"I found not just a room, but a friend for life. The compatibility matching is incredible!"</p>
                <p className="mt-4 font-semibold">- Alex D.</p>
            </div>
        </div>
      </div>

      {/* --- GREEN-THEMED RIGHT SIDE FORM --- */}
      {/* COLOR: Background changed from slate-50 to green-50 */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-green-50/50">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-stone-800">Create an Account</CardTitle>
              <CardDescription className="text-stone-600 pt-2">Step 1 of 2: Let's get you started</CardDescription>
              {/* This progress bar is already green */}
              <Progress value={50} className="mt-4 [&>*]:bg-emerald-500" />
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {/* COLOR: Themed the social login button */}
              <form onSubmit={handleSignup} className="space-y-4">
                {/* COLOR: Unselected border changed from gray to green */}
                <RadioGroup defaultValue="Seeker" onValueChange={handleRoleChange} className="grid grid-cols-2 gap-4">
                  <Label htmlFor="seeker" className="flex flex-col items-center justify-center rounded-md border-2 border-green-200 bg-popover p-4 hover:bg-green-100 hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-emerald-500 [&:has([data-state=checked])]:bg-emerald-50">
                    <RadioGroupItem value="Seeker" id="seeker" className="sr-only" />
                    <Search className="mb-3 h-6 w-6" />
                    Room Seeker
                  </Label>
                  <Label htmlFor="lister" className="flex flex-col items-center justify-center rounded-md border-2 border-green-200 bg-popover p-4 hover:bg-green-100 hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-emerald-500 [&:has([data-state=checked])]:bg-emerald-50">
                    <RadioGroupItem value="Lister" id="lister" className="sr-only" />
                    <Home className="mb-3 h-6 w-6" />
                    Room Lister
                  </Label>
                </RadioGroup>

                {/* COLOR: Input icons changed from gray to green */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-700/60" />
                  <Input id="username" name="username" placeholder="Username" onChange={handleChange} required className="pl-10 h-12 focus-visible:ring-emerald-500" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-700/60" />
                  <Input id="email" name="email" type="email" placeholder="Email address" onChange={handleChange} required className="pl-10 h-12 focus-visible:ring-emerald-500" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-700/60" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Password (8+ characters)" onChange={handleChange} required className="pl-10 pr-12 h-12 focus-visible:ring-emerald-500" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700/60" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                
                {/* COLOR: Error text changed from red to dark green as requested */}
                {error && <p className="text-sm text-green-900 pt-1 text-center font-bold">{error}</p>}
                
                <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Continue'}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </form>
              <div className="text-center mt-6">
                <span className="text-stone-600">Already have an account? </span>
                <Link to="/login" className="text-emerald-600 hover:underline font-semibold">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}