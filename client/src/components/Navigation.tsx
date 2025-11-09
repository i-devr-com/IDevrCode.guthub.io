import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2 } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/app-builder", label: "App Builder" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2" data-testid="link-home-logo">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">I-DevR Code</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/app-builder">
              <Button data-testid="button-get-started">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover-elevate active-elevate-2"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium hover-elevate active-elevate-2 ${
                    location === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/app-builder">
              <Button className="w-full" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-get-started">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
