import { Link } from "wouter";
import { Code2, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">I-DevR Code</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional coding solutions, custom app development, and expert website repair services.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/app-builder">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-app-builder">
                    App Builder
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services?tab=custom">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-custom-coding">
                    Custom Coding
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services?tab=repairs">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-repairs">
                    Website Repairs
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                    Home
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Worcester, MA<br />Serving Globally</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href="mailto:contact@idevrcode.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-email">
                  contact@idevrcode.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} I-DevR Code. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
