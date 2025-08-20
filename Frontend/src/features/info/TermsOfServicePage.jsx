import { MainLayout } from "../../components/MainLayout";
import { Card, CardContent } from "../../components/ui/card";

export default function TermsOfServicePage() {
  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </CardContent>
        </Card>
      </div>
  );
}