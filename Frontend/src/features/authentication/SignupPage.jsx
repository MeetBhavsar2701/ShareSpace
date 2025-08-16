import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Create your account</CardTitle>
          <CardDescription>Find your space. Share your world.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" placeholder="Alex Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label>I am a...</Label>
              <RadioGroup defaultValue="seeker" className="flex pt-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seeker" id="r1" />
                  <Label htmlFor="r1">Room Seeker</Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <RadioGroupItem value="lister" id="r2" />
                  <Label htmlFor="r2">Room Lister</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline text-blue-600">
              Log in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}