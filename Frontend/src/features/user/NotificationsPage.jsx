import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 text-center">
        <div className="py-16">
          <Bell className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
          <h1 className="text-4xl font-bold">Notifications</h1>
          <p className="text-xl text-gray-600 mt-4">
            This page will show your recent account activity. This feature is coming soon!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
