import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, Wrench, Sparkles, Check } from "lucide-react";
import heroImage from "@assets/generated_images/Developer_workspace_hero_fb71a12a.png";
import appBuilderImg from "@assets/generated_images/App_builder_illustration_23aed762.png";
import customCodingImg from "@assets/generated_images/Custom_coding_service_visual_d704cbea.png";
import repairServicesImg from "@assets/generated_images/Repair_services_illustration_8ea7d66b.png";

export default function Home() {
  const services = [
    {
      title: "Custom App Builder",
      description: "Build your own app with our drag-and-drop builder. Choose components, customize, and deploy instantly.",
      image: appBuilderImg,
      icon: Sparkles,
      href: "/app-builder",
      features: ["Visual Component Builder", "Real-Time Pricing", "Instant Download", "Professional Code"],
      cta: "Try App Builder",
      testId: "card-service-app-builder"
    },
    {
      title: "Custom Coding",
      description: "Need something unique? Our expert developers build custom solutions tailored to your exact requirements.",
      image: customCodingImg,
      icon: Code2,
      href: "/services?tab=custom",
      features: ["Tailored Solutions", "Expert Developers", "Modern Tech Stack", "Full Support"],
      cta: "Get Custom Quote",
      testId: "card-service-custom-coding"
    },
    {
      title: "Website Repairs",
      description: "Broken website? Slow performance? We diagnose and fix issues quickly to get you back online.",
      image: repairServicesImg,
      icon: Wrench,
      href: "/services?tab=repairs",
      features: ["Fast Diagnostics", "Expert Fixes", "Performance Optimization", "Ongoing Support"],
      cta: "Request Repair",
      testId: "card-service-repairs"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            I-DevR Code: Custom Coding,<br />
            <span className="text-primary">App Building & Repairs</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Professional development services from Worcester, MA serving clients globally.
            Build apps instantly, request custom development, or get expert repairs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/app-builder">
              <Button size="lg" className="text-lg px-8 py-6 min-h-14" data-testid="button-hero-try-builder">
                Try the App Builder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 min-h-14 bg-background/50 backdrop-blur-sm" data-testid="button-hero-view-services">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-services-title">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the perfect solution for your needs. From instant app building to custom development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="hover-elevate transition-all duration-300 flex flex-col" data-testid={service.testId}>
                <CardHeader className="pb-4">
                  <div className="w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <service.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={service.href}>
                    <Button className="w-full" data-testid={`button-${service.testId}-cta`}>
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-cta-title">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Whether you need a quick app build or comprehensive custom development,
            we're here to help bring your vision to life.
          </p>
          <Link href="/app-builder">
            <Button size="lg" className="text-lg px-8 py-6 min-h-14" data-testid="button-cta-start">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
