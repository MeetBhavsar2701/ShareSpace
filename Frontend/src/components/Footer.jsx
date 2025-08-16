export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Sharespace, Inc. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/help" className="hover:text-primary">Help Center</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}