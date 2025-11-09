import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, Download, Loader2, Home, ArrowRight } from "lucide-react";
import type { AppProject } from "@shared/schema";

export default function Success() {
  const [match, params] = useRoute("/success/:id");
  const projectId = params?.id;

  const { data: project, isLoading } = useQuery<AppProject>({
    queryKey: ['/api/app-builder/projects', projectId],
    enabled: !!projectId,
  });

  const downloadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("GET", `/api/app-builder/download/${id}`, undefined);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.projectName || 'app'}-source-code.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  });

  if (!match || !projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
            <CardDescription>This page does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPaid = project.isPaid === "true";

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="border-primary/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2" data-testid="text-success-title">
              {isPaid ? "Payment Successful!" : "Processing Payment..."}
            </CardTitle>
            <CardDescription className="text-base">
              {isPaid 
                ? "Your app is ready to download"
                : "Please wait while we confirm your payment..."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPaid ? (
              <>
                <div className="bg-muted p-6 rounded-md space-y-3">
                  <h3 className="font-semibold text-lg">Project: {project.projectName}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• <span className="font-medium text-foreground">{project.components.length}</span> components included</p>
                    <p>• Production-ready source code</p>
                    <p>• Responsive design</p>
                    <p>• Clean, documented code</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => downloadMutation.mutate(project.id)}
                  disabled={downloadMutation.isPending}
                  data-testid="button-download"
                >
                  {downloadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download Source Code
                    </>
                  )}
                </Button>

                <div className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Need another app or custom development?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/app-builder">
                      <Button variant="outline" className="w-full" data-testid="button-build-another">
                        Build Another App
                      </Button>
                    </Link>
                    <Link href="/services">
                      <Button variant="outline" className="w-full" data-testid="button-custom-services">
                        Custom Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Verifying your payment with Stripe...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This usually takes just a few seconds
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isPaid && (
          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="ghost" data-testid="button-home">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
