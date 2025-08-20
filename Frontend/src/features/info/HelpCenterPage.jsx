import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto py-12 px-4 text-center">
        <div className="py-16">
          <LifeBuoy className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
          <h1 className="text-4xl font-bold">Help Center</h1>
          <p className="text-xl text-gray-600 mt-4">
            Find answers to frequently asked questions below.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="text-left">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Q: How do I create a listing?</h3>
              <p className="text-muted-foreground">
                To create a new listing, navigate to your dashboard and click the "Add Listing" button. Fill out the required information, including details about the property, photos, and your roommate preferences.
              </p>
            </CardContent>
          </Card>
          <Card className="text-left">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Q: How do I find a roommate?</h3>
              <p className="text-muted-foreground">
                You can browse listings on the "Listings" page. Use the filters to narrow down your search based on location, price, and other preferences. Once you find a suitable listing, you can view the profile of the user who posted it and start a chat.
              </p>
            </CardContent>
          </Card>
          <Card className="text-left">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Q: What should I do if I find a bug?</h3>
              <p className="text-muted-foreground">
                We're sorry you've encountered an issue. Please contact our support team at support@sharespace.com with a detailed description of the bug, including the steps to reproduce it and any error messages you received.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}