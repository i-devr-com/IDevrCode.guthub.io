import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  LayoutTemplate,
  Navigation,
  Mail,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Grid3x3,
  Star,
  CreditCard,
  Megaphone,
  Plus,
  Trash2,
  ShoppingCart,
  Check,
  Code2,
  Copy,
  Eye
} from "lucide-react";
import type { ComponentType, InsertAppProject } from "@shared/schema";
import { componentPricing, BASE_APP_PRICE } from "@shared/schema";

const componentIcons: Record<ComponentType, any> = {
  "hero": LayoutTemplate,
  "header": Navigation,
  "contact-form": Mail,
  "about-section": FileText,
  "image-gallery": ImageIcon,
  "footer": MessageSquare,
  "feature-grid": Grid3x3,
  "testimonials": Star,
  "pricing-table": CreditCard,
  "cta-section": Megaphone
};

const componentDescriptions: Record<ComponentType, string> = {
  "hero": "Eye-catching hero section with headline and CTA",
  "header": "Navigation bar with logo and menu links",
  "contact-form": "Professional contact form with validation",
  "about-section": "About section with text and imagery",
  "image-gallery": "Responsive image gallery with lightbox",
  "footer": "Footer with links and contact info",
  "feature-grid": "Grid layout showcasing key features",
  "testimonials": "Customer testimonials carousel",
  "pricing-table": "Pricing comparison table",
  "cta-section": "Call-to-action section with button"
};

const generateComponentHTML = (component: ComponentType): string => {
  const templates: Record<ComponentType, string> = {
    "hero": `<!-- Hero Section -->
<section class="hero-section">
  <div class="container">
    <h1>Welcome to Your Amazing Website</h1>
    <p>Create something extraordinary with our platform</p>
    <button class="cta-button">Get Started</button>
  </div>
</section>`,
    "header": `<!-- Header Navigation -->
<header class="main-header">
  <nav class="navbar">
    <div class="logo">Your Brand</div>
    <ul class="nav-menu">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>`,
    "contact-form": `<!-- Contact Form -->
<section class="contact-form-section">
  <form class="contact-form">
    <input type="text" placeholder="Your Name" required>
    <input type="email" placeholder="Your Email" required>
    <textarea placeholder="Your Message" rows="5" required></textarea>
    <button type="submit">Send Message</button>
  </form>
</section>`,
    "about-section": `<!-- About Section -->
<section class="about-section">
  <div class="container">
    <h2>About Us</h2>
    <p>We are passionate about delivering exceptional experiences...</p>
  </div>
</section>`,
    "image-gallery": `<!-- Image Gallery -->
<section class="gallery-section">
  <div class="gallery-grid">
    <div class="gallery-item"><img src="image1.jpg" alt="Gallery 1"></div>
    <div class="gallery-item"><img src="image2.jpg" alt="Gallery 2"></div>
    <div class="gallery-item"><img src="image3.jpg" alt="Gallery 3"></div>
  </div>
</section>`,
    "footer": `<!-- Footer -->
<footer class="main-footer">
  <div class="container">
    <p>&copy; 2025 Your Company. All rights reserved.</p>
    <ul class="footer-links">
      <li><a href="#privacy">Privacy Policy</a></li>
      <li><a href="#terms">Terms of Service</a></li>
    </ul>
  </div>
</footer>`,
    "feature-grid": `<!-- Feature Grid -->
<section class="features-section">
  <div class="feature-grid">
    <div class="feature-item">
      <h3>Feature One</h3>
      <p>Amazing capability that sets you apart</p>
    </div>
    <div class="feature-item">
      <h3>Feature Two</h3>
      <p>Another incredible feature</p>
    </div>
  </div>
</section>`,
    "testimonials": `<!-- Testimonials -->
<section class="testimonials-section">
  <div class="testimonial-card">
    <p>"This is an amazing service!"</p>
    <span class="author">- Happy Customer</span>
  </div>
</section>`,
    "pricing-table": `<!-- Pricing Table -->
<section class="pricing-section">
  <div class="pricing-grid">
    <div class="pricing-card">
      <h3>Basic</h3>
      <div class="price">$9.99/mo</div>
      <button>Choose Plan</button>
    </div>
  </div>
</section>`,
    "cta-section": `<!-- Call to Action -->
<section class="cta-section">
  <h2>Ready to Get Started?</h2>
  <button class="cta-button">Start Now</button>
</section>`
  };
  return templates[component];
};

const generateCSS = (): string => {
  return `/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}`;
};

const generateJS = (): string => {
  return `// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized');
  
  // Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Form submitted!');
    });
  });
});`;
};

export default function AppBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("");
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const [previewTab, setPreviewTab] = useState<"visual" | "code">("visual");

  const totalPrice = BASE_APP_PRICE + selectedComponents.reduce((sum, comp) => sum + componentPricing[comp], 0);

  const availableComponents: ComponentType[] = Object.keys(componentPricing) as ComponentType[];

  const addComponent = (component: ComponentType) => {
    setSelectedComponents([...selectedComponents, component]);
    toast({
      title: "Component Added",
      description: `${component.replace(/-/g, ' ')} added to your app (+$${componentPricing[component]})`,
    });
  };

  const removeComponent = (index: number) => {
    const removed = selectedComponents[index];
    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
    toast({
      title: "Component Removed",
      description: `${removed.replace(/-/g, ' ')} removed from your app`,
    });
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `${type} code copied to clipboard`,
    });
  };

  const fullHTML = selectedComponents.map(generateComponentHTML).join('\n\n');
  const fullCSS = generateCSS();
  const fullJS = generateJS();

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertAppProject) => {
      const response = await apiRequest("POST", "/api/app-builder/projects", data);
      if (!response.ok) throw new Error("Failed to create project");
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/checkout/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCheckout = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project Name Required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      });
      return;
    }

    if (selectedComponents.length === 0) {
      toast({
        title: "No Components Selected",
        description: "Please add at least one component to your app.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      projectName: projectName.trim(),
      components: selectedComponents,
      totalPrice,
      isPaid: "false"
    });
  };

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" data-testid="text-builder-title">
            Build Your <span className="text-primary">Custom App</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Select components, customize your app, and get production-ready code instantly after payment.
          </p>
        </div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Component Palette - Left Sidebar */}
          <div className="lg:col-span-4">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Available Components</CardTitle>
                <CardDescription>
                  Click to add components to your app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {availableComponents.map((component) => {
                      const Icon = componentIcons[component];
                      const price = componentPricing[component];
                      return (
                        <Card
                          key={component}
                          className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                          onClick={() => addComponent(component)}
                          data-testid={`card-component-${component}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-sm capitalize">
                                    {component.replace(/-/g, ' ')}
                                  </h3>
                                  <Badge variant="secondary" className="flex-shrink-0">
                                    ${price}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {componentDescriptions[component]}
                                </p>
                              </div>
                              <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Canvas - Center */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your App Preview</CardTitle>
                    <CardDescription>
                      Components you've selected will appear here
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    data-testid="input-project-name"
                  />
                </div>
                <Separator className="my-4" />
                <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as "visual" | "code")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="visual" data-testid="tab-visual-preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Visual Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" data-testid="tab-code-preview">
                      <Code2 className="h-4 w-4 mr-2" />
                      Code Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="visual">
                    <ScrollArea className="h-[500px] pr-4">
                      {selectedComponents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <LayoutTemplate className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">No Components Yet</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Start building by selecting components from the left panel
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedComponents.map((component, index) => {
                            const Icon = componentIcons[component];
                            return (
                              <Card key={`${component}-${index}`} className="bg-muted/50" data-testid={`preview-component-${index}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm capitalize">
                                        {component.replace(/-/g, ' ')}
                                      </p>
                                      <p className="text-xs text-muted-foreground font-mono">
                                        ${componentPricing[component]}
                                      </p>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => removeComponent(index)}
                                      data-testid={`button-remove-${index}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="code">
                    <ScrollArea className="h-[500px]">
                      {selectedComponents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Code2 className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">No Code Yet</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Add components to see generated code
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 pr-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="font-mono">HTML</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(fullHTML, "HTML")}
                                data-testid="button-copy-html"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="rounded-md overflow-hidden" data-testid="code-html">
                              <SyntaxHighlighter
                                language="html"
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  fontSize: '0.75rem',
                                  borderRadius: '0.375rem'
                                }}
                              >
                                {fullHTML || '<!-- Your components will appear here -->'}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="font-mono">CSS</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(fullCSS, "CSS")}
                                data-testid="button-copy-css"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="rounded-md overflow-hidden" data-testid="code-css">
                              <SyntaxHighlighter
                                language="css"
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  fontSize: '0.75rem',
                                  borderRadius: '0.375rem'
                                }}
                              >
                                {fullCSS}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="font-mono">JavaScript</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(fullJS, "JavaScript")}
                                data-testid="button-copy-js"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="rounded-md overflow-hidden" data-testid="code-js">
                              <SyntaxHighlighter
                                language="javascript"
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  fontSize: '0.75rem',
                                  borderRadius: '0.375rem'
                                }}
                              >
                                {fullJS}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Calculator - Right Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Pricing Summary</CardTitle>
                <CardDescription>
                  Real-time price calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base App Price</span>
                    <span className="font-medium">${BASE_APP_PRICE}</span>
                  </div>
                  {selectedComponents.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {selectedComponents.map((component, index) => (
                          <div key={`price-${component}-${index}`} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">
                              {component.replace(/-/g, ' ')}
                            </span>
                            <span className="font-medium">${componentPricing[component]}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-total-price">${totalPrice}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">What You Get:</h4>
                  <div className="space-y-2">
                    {[
                      "Production-ready source code",
                      "Responsive design",
                      "Clean, documented code",
                      "Instant download after payment"
                    ].map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={createProjectMutation.isPending || selectedComponents.length === 0}
                  data-testid="button-proceed-checkout"
                >
                  {createProjectMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      Proceed to Checkout
                      <ShoppingCart className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
