import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import type { AppProject } from "@shared/schema";
import { componentPricing, BASE_APP_PRICE } from "@shared/schema";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ project }: { project: AppProject }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success/${project.id}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Complete Payment - ${project.totalPrice}
            <CreditCard className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const [match, params] = useRoute("/checkout/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");

  const projectId = params?.id;

  const { data: project, isLoading: projectLoading } = useQuery<AppProject>({
    queryKey: ['/api/app-builder/projects', projectId],
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!project) return;

    if (project.isPaid === "true") {
      setLocation(`/success/${project.id}`);
      return;
    }

    apiRequest("POST", "/api/create-payment-intent", { amount: project.totalPrice, projectId: project.id })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [project, setLocation, toast]);

  if (!match || !projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Checkout</CardTitle>
            <CardDescription>This checkout link is not valid.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (projectLoading || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2" data-testid="text-checkout-title">
            Complete Your <span className="text-primary">Purchase</span>
          </h1>
          <p className="text-muted-foreground">
            Secure checkout for: <span className="font-semibold">{project.projectName}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Project: {project.projectName}</h3>
                <Badge variant="secondary">{project.components.length} Components</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base App Price</span>
                  <span className="font-medium">${BASE_APP_PRICE}</span>
                </div>
                {project.components.map((component, index) => (
                  <div key={`${component}-${index}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{component.replace(/-/g, ' ')}</span>
                    <span className="font-medium">${componentPricing[component]}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${project.totalPrice}</span>
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <h4 className="font-semibold text-sm">After Payment:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Instant access to download page</li>
                  <li>✓ Complete source code package</li>
                  <li>✓ All selected components included</li>
                  <li>✓ Production-ready code</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Enter your payment information to complete the purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm project={project} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
