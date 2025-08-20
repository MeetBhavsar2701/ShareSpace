import { MainLayout } from "../../components/MainLayout";
import { Card, CardContent } from "../../components/ui/card";

export default function PrivacyPolicyPage() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information to provide and improve our services to you. This includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>
                <strong>Personal Information:</strong> When you create an account, we may ask for your name, email address, and other contact details.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect information on how the service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              The information we collect is used to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Provide and maintain our Service.</li>
              <li>Notify you about changes to our Service.</li>
              <li>Allow you to participate in interactive features of our Service when you choose to do so.</li>
              <li>Provide customer support.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </CardContent>
        </Card>
      </div>
  );
}