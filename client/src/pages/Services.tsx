import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, Wrench, Send, CheckCircle2 } from "lucide-react";
import { insertCustomQuoteSchema, insertRepairQuoteSchema } from "@shared/schema";
import type { InsertCustomQuote, InsertRepairQuote } from "@shared/schema";

export default function Services() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("custom");

  // Custom Quote Form
  const customForm = useForm<InsertCustomQuote>({
    resolver: zodResolver(insertCustomQuoteSchema),
    defaultValues: {
      name: "",
      email: "",
      projectDescription: "",
      budget: "",
      timeline: ""
    }
  });

  // Repair Quote Form
  const repairForm = useForm<InsertRepairQuote>({
    resolver: zodResolver(insertRepairQuoteSchema),
    defaultValues: {
      name: "",
      email: "",
      websiteUrl: "",
      issueDescription: "",
      priority: "normal"
    }
  });

  // Custom Quote Mutation
  const customQuoteMutation = useMutation({
    mutationFn: async (data: InsertCustomQuote) => {
      const response = await apiRequest("POST", "/api/quotes/custom", data);
      if (!response.ok) throw new Error("Failed to submit quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote Request Submitted!",
        description: "We'll review your project and get back to you within 24 hours.",
      });
      customForm.reset();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  // Repair Quote Mutation
  const repairQuoteMutation = useMutation({
    mutationFn: async (data: InsertRepairQuote) => {
      const response = await apiRequest("POST", "/api/quotes/repair", data);
      if (!response.ok) throw new Error("Failed to submit repair request");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Repair Request Submitted!",
        description: "We'll diagnose your issue and contact you with a solution soon.",
      });
      repairForm.reset();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const onCustomSubmit = (data: InsertCustomQuote) => {
    customQuoteMutation.mutate(data);
  };

  const onRepairSubmit = (data: InsertRepairQuote) => {
    repairQuoteMutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4" data-testid="text-services-page-title">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Request a custom quote or repair service. We'll respond within 24 hours with pricing and next steps.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="custom" data-testid="tab-custom-coding">
              <Code2 className="h-4 w-4 mr-2" />
              Custom Coding
            </TabsTrigger>
            <TabsTrigger value="repairs" data-testid="tab-repairs">
              <Wrench className="h-4 w-4 mr-2" />
              Website Repairs
            </TabsTrigger>
          </TabsList>

          {/* Custom Coding Tab */}
          <TabsContent value="custom">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Request Custom Development</CardTitle>
                  <CardDescription>
                    Tell us about your project and we'll provide a detailed quote with timeline and pricing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...customForm}>
                    <form onSubmit={customForm.handleSubmit(onCustomSubmit)} className="space-y-4">
                      <FormField
                        control={customForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="input-custom-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-custom-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customForm.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what you need built, key features, and any technical requirements..."
                                className="min-h-32"
                                {...field}
                                data-testid="input-custom-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., $1,000 - $5,000" {...field} data-testid="input-custom-budget" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeline (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2-4 weeks" {...field} data-testid="input-custom-timeline" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={customQuoteMutation.isPending}
                        data-testid="button-submit-custom-quote"
                      >
                        {customQuoteMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit Request
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Info Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What We Build</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Full-stack web applications",
                      "RESTful APIs and backend services",
                      "Database design and integration",
                      "Third-party API integrations",
                      "E-commerce platforms",
                      "Custom dashboards and admin panels",
                      "Progressive Web Apps (PWAs)",
                      "And much more..."
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Our Process</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">1. Review:</span> We analyze your requirements within 24 hours.</p>
                    <p><span className="font-semibold text-foreground">2. Quote:</span> Receive detailed pricing and timeline.</p>
                    <p><span className="font-semibold text-foreground">3. Build:</span> We develop your solution with regular updates.</p>
                    <p><span className="font-semibold text-foreground">4. Deliver:</span> Test, refine, and deploy your project.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Repairs Tab */}
          <TabsContent value="repairs">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Request Website Repair</CardTitle>
                  <CardDescription>
                    Describe the issue you're experiencing and we'll diagnose and fix it quickly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...repairForm}>
                    <form onSubmit={repairForm.handleSubmit(onRepairSubmit)} className="space-y-4">
                      <FormField
                        control={repairForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="input-repair-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-repair-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL (Optional)</FormLabel>
                            <FormControl>
                              <Input type="url" placeholder="https://yourwebsite.com" {...field} data-testid="input-repair-url" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="issueDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the problem: Is the site down? Slow? Showing errors? When did it start?..."
                                className="min-h-32"
                                {...field}
                                data-testid="input-repair-issue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-repair-priority">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low - Not urgent</SelectItem>
                                <SelectItem value="normal">Normal - Within a few days</SelectItem>
                                <SelectItem value="high">High - Within 24 hours</SelectItem>
                                <SelectItem value="critical">Critical - Site is down</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={repairQuoteMutation.isPending}
                        data-testid="button-submit-repair-quote"
                      >
                        {repairQuoteMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit Repair Request
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Info Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Issues We Fix</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Website downtime and crashes",
                      "Slow page load times",
                      "Broken links and images",
                      "Security vulnerabilities",
                      "Database errors",
                      "Plugin/theme conflicts",
                      "Mobile responsiveness issues",
                      "SEO and performance optimization"
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Critical:</span> Response within 2-4 hours</p>
                    <p><span className="font-semibold text-foreground">High:</span> Response within 12 hours</p>
                    <p><span className="font-semibold text-foreground">Normal:</span> Response within 24 hours</p>
                    <p><span className="font-semibold text-foreground">Low:</span> Response within 48 hours</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
