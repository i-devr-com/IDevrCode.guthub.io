import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Wrench, Check } from "lucide-react";
import type { CustomQuote, RepairQuote } from "@shared/schema";

export default function AdminDashboard() {
  const { data: customQuotes = [] } = useQuery<CustomQuote[]>({
    queryKey: ['/api/admin/quotes/custom'],
  });

  const { data: repairQuotes = [] } = useQuery<RepairQuote[]>({
    queryKey: ['/api/admin/quotes/repair'],
  });

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2" data-testid="text-admin-title">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage payment settings and view quote requests
          </p>
        </div>

        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="w-full max-w-md mb-8">
            <TabsTrigger value="quotes" data-testid="tab-quotes">
              <FileText className="h-4 w-4 mr-2" />
              Quote Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-6">
            {/* Custom Coding Quotes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Custom Coding Requests
                </CardTitle>
                <CardDescription>
                  Review and manage custom development quote requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customQuotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No custom coding requests yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {customQuotes.map((quote) => (
                      <Card key={quote.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold">{quote.name}</h3>
                              <p className="text-sm text-muted-foreground">{quote.email}</p>
                            </div>
                            <Badge variant={quote.status === "pending" ? "secondary" : "default"}>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{quote.projectDescription}</p>
                          {quote.budget && (
                            <p className="text-xs text-muted-foreground">Budget: {quote.budget}</p>
                          )}
                          {quote.timeline && (
                            <p className="text-xs text-muted-foreground">Timeline: {quote.timeline}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Repair Quotes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Repair Service Requests
                </CardTitle>
                <CardDescription>
                  Review and manage website repair requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {repairQuotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No repair requests yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {repairQuotes.map((quote) => (
                      <Card key={quote.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold">{quote.name}</h3>
                              <p className="text-sm text-muted-foreground">{quote.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={quote.priority === "critical" ? "destructive" : "secondary"}>
                                {quote.priority}
                              </Badge>
                              <Badge variant={quote.status === "pending" ? "secondary" : "default"}>
                                {quote.status}
                              </Badge>
                            </div>
                          </div>
                          {quote.websiteUrl && (
                            <p className="text-sm font-medium mb-2">URL: {quote.websiteUrl}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-2">{quote.issueDescription}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
