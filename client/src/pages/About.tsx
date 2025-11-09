import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Globe, Users, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Code2,
      title: "Expert Craftsmanship",
      description: "Every line of code is written with precision, following industry best practices and modern standards."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "We understand time is valuable. Our streamlined processes ensure quick turnaround without compromising quality."
    },
    {
      icon: Users,
      title: "Client-Focused",
      description: "Your success is our success. We work closely with you to understand and exceed your expectations."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Based in Worcester, MA, we serve clients worldwide with the same level of dedication and professionalism."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6" data-testid="text-about-title">
            About <span className="text-primary">I-DevR Code</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-about-description">
            We are a professional development company specializing in custom coding solutions,
            interactive app building, and expert website repairs. Operating online from Worcester, MA,
            we serve clients across the globe with cutting-edge technology and exceptional service.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-center" data-testid="text-mission-title">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-6">
              At I-DevR Code, we believe that powerful software solutions should be accessible to everyone.
              Whether you're a startup founder with a vision, a business owner needing repairs, or someone
              who wants to build an app without coding knowledge, we're here to make it happen.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Our innovative app builder democratizes software development, while our custom coding and
              repair services ensure you always have expert support when you need it most.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="hover-elevate transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight mb-6 text-center">
            Our Expertise
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              <span className="font-semibold text-foreground">Custom App Builder:</span> Our flagship
              product allows anyone to create professional web applications through an intuitive
              drag-and-drop interface. Select from pre-built components, see your price in real-time,
              and receive production-ready code instantly after payment.
            </p>
            <p className="text-lg">
              <span className="font-semibold text-foreground">Custom Coding:</span> For projects that
              require unique functionality or complex integrations, our experienced developers build
              tailored solutions using modern frameworks and best practices. From APIs to full-stack
              applications, we handle it all.
            </p>
            <p className="text-lg">
              <span className="font-semibold text-foreground">Website Repairs:</span> When things break,
              we fix them fast. Our diagnostic process quickly identifies issues, and our expert team
              resolves problems efficiently, getting your website back online with improved performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
