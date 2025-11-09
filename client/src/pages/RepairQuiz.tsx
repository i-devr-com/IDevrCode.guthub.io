import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Send
} from "lucide-react";
import type { InsertRepairQuote } from "@shared/schema";

type QuizStep = 1 | 2 | 3 | 4;

interface QuizAnswers {
  issueType: string;
  severity: string;
  timeframe: string;
  affectedAreas: string;
  name: string;
  email: string;
  websiteUrl: string;
  additionalDetails: string;
}

export default function RepairQuiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuizStep>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    issueType: "",
    severity: "",
    timeframe: "",
    affectedAreas: "",
    name: "",
    email: "",
    websiteUrl: "",
    additionalDetails: ""
  });

  const calculateEstimate = () => {
    let basePrice = 100;
    
    // Issue type pricing
    const issueTypePricing: Record<string, number> = {
      "downtime": 200,
      "slow": 150,
      "errors": 175,
      "security": 250,
      "design": 125,
      "functionality": 175
    };
    basePrice += issueTypePricing[answers.issueType] || 100;

    // Severity multiplier
    const severityMultiplier: Record<string, number> = {
      "minor": 1,
      "moderate": 1.3,
      "severe": 1.6,
      "critical": 2
    };
    basePrice *= severityMultiplier[answers.severity] || 1;

    // Timeframe impact
    const timeframeAdjustment: Record<string, number> = {
      "asap": 100,
      "1-2-days": 50,
      "1-week": 0,
      "flexible": -25
    };
    basePrice += timeframeAdjustment[answers.timeframe] || 0;

    return {
      low: Math.round(basePrice * 0.8),
      high: Math.round(basePrice * 1.2)
    };
  };

  const repairQuoteMutation = useMutation({
    mutationFn: async (data: InsertRepairQuote) => {
      const response = await apiRequest("POST", "/api/quotes/repair", data);
      if (!response.ok) throw new Error("Failed to submit quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote Submitted!",
        description: "We'll review your issue and get back to you within 24 hours.",
      });
      setTimeout(() => setLocation("/services"), 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    const estimate = calculateEstimate();
    const priorityMap: Record<string, string> = {
      "minor": "low",
      "moderate": "normal",
      "severe": "high",
      "critical": "critical"
    };

    const issueDescription = `
Issue Type: ${answers.issueType}
Severity: ${answers.severity}
Timeframe Needed: ${answers.timeframe}
Affected Areas: ${answers.affectedAreas}
Additional Details: ${answers.additionalDetails}
Estimated Cost Range: $${estimate.low} - $${estimate.high}
    `.trim();

    repairQuoteMutation.mutate({
      name: answers.name,
      email: answers.email,
      websiteUrl: answers.websiteUrl || undefined,
      issueDescription,
      priority: priorityMap[answers.severity] || "normal"
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return answers.issueType && answers.severity;
      case 2:
        return answers.timeframe && answers.affectedAreas;
      case 3:
        return answers.name && answers.email;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep((currentStep + 1) as QuizStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as QuizStep);
    }
  };

  const estimate = calculateEstimate();
  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3" data-testid="text-quiz-title">
            Website Repair <span className="text-primary">Diagnostic</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Answer a few questions to get an instant repair estimate
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-quiz" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "What's the problem?"}
              {currentStep === 2 && "Additional details"}
              {currentStep === 3 && "Your contact information"}
              {currentStep === 4 && "Review & submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about the issue you're experiencing"}
              {currentStep === 2 && "Help us understand the scope and urgency"}
              {currentStep === 3 && "How can we reach you?"}
              {currentStep === 4 && "Your estimated repair cost"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-3">
                  <Label>What type of issue are you experiencing? *</Label>
                  <RadioGroup value={answers.issueType} onValueChange={(v) => setAnswers({ ...answers, issueType: v })}>
                    {[
                      { value: "downtime", label: "Website is down/offline", icon: AlertTriangle },
                      { value: "slow", label: "Slow loading times", icon: Clock },
                      { value: "errors", label: "Error messages appearing", icon: AlertTriangle },
                      { value: "security", label: "Security concerns/breach", icon: AlertTriangle },
                      { value: "design", label: "Layout/design broken", icon: AlertTriangle },
                      { value: "functionality", label: "Features not working", icon: AlertTriangle }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-issue-${option.value}`} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>How severe is the issue? *</Label>
                  <RadioGroup value={answers.severity} onValueChange={(v) => setAnswers({ ...answers, severity: v })}>
                    {[
                      { value: "minor", label: "Minor - Annoying but not urgent" },
                      { value: "moderate", label: "Moderate - Affecting some users" },
                      { value: "severe", label: "Severe - Impacting business significantly" },
                      { value: "critical", label: "Critical - Site completely unusable" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-severity-${option.value}`} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-3">
                  <Label>When do you need this fixed? *</Label>
                  <RadioGroup value={answers.timeframe} onValueChange={(v) => setAnswers({ ...answers, timeframe: v })}>
                    {[
                      { value: "asap", label: "ASAP (within 24 hours)" },
                      { value: "1-2-days", label: "Within 1-2 days" },
                      { value: "1-week", label: "Within a week" },
                      { value: "flexible", label: "I'm flexible on timing" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-timeframe-${option.value}`} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affected">Which parts of your site are affected? *</Label>
                  <Input
                    id="affected"
                    placeholder="e.g., Homepage, Contact form, Checkout page"
                    value={answers.affectedAreas}
                    onChange={(e) => setAnswers({ ...answers, affectedAreas: e.target.value })}
                    data-testid="input-affected-areas"
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={answers.name}
                    onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                    data-testid="input-quiz-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={answers.email}
                    onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                    data-testid="input-quiz-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={answers.websiteUrl}
                    onChange={(e) => setAnswers({ ...answers, websiteUrl: e.target.value })}
                    data-testid="input-quiz-url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details (Optional)</Label>
                  <Textarea
                    id="details"
                    placeholder="Any other information that might help us..."
                    value={answers.additionalDetails}
                    onChange={(e) => setAnswers({ ...answers, additionalDetails: e.target.value })}
                    className="min-h-24"
                    data-testid="textarea-quiz-details"
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <DollarSign className="h-12 w-12 text-primary mx-auto" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Cost Range</p>
                        <p className="text-3xl font-bold text-primary" data-testid="text-estimate-range">
                          ${estimate.low} - ${estimate.high}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Final price may vary based on complexity. We'll provide a detailed quote after review.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Your information:</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Issue: <span className="text-foreground capitalize">{answers.issueType.replace(/-/g, ' ')}</span></p>
                    <p>• Severity: <span className="text-foreground capitalize">{answers.severity}</span></p>
                    <p>• Timeframe: <span className="text-foreground capitalize">{answers.timeframe.replace(/-/g, ' ')}</span></p>
                    <p>• Name: <span className="text-foreground">{answers.name}</span></p>
                    <p>• Email: <span className="text-foreground">{answers.email}</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    We'll review your issue and send a detailed quote within 24 hours. You're under no obligation to proceed.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="button-quiz-prev"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  data-testid="button-quiz-next"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={repairQuoteMutation.isPending || !canProceed()}
                  data-testid="button-quiz-submit"
                >
                  {repairQuoteMutation.isPending ? "Submitting..." : (
                    <>
                      Submit Request
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
