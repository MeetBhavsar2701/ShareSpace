import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://i.pravatar.cc/150" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Alex Doe</h1>
              <p className="text-muted-foreground">Joined in 2024</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Alex Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" placeholder="Tell us a little bit about yourself" defaultValue="I'm a software engineer who loves hiking, board games, and finding the best coffee shops in town. Looking for a clean and friendly living space!" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}