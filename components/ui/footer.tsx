import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Image
                  src="/republic-bank.jpg"
                  alt="RepublicLunch Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-semibold text-lg">RepublicLunch</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Lunch ordering made easy for your workplace
            </p>
          </div>

          {/* Quick Links */}
          

          {/* Contact */}
        </div>
        <div className="relative w-full h-80">

          <Image src='/food-2.jpg' alt='Republic Bank' fill className="object-cover object-center"  />
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Republic Bank. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
