import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div role="main" className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">HireArya</h1>
        <p className="text-muted-foreground">
          AI-powered hiring platform. Production-grade, feature-based architecture.
        </p>
        <Link href="/features">
          <Button className="mb-6">View All Features</Button>
        </Link>
        <div className="flex flex-wrap justify-center gap-4">
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Sales Agent / Hunter</CardTitle>
              <CardDescription>AI-powered sales candidate sourcing and outreach</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agent/sales">
                <Button className="w-full">Launch Hunter</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Agent Builder</CardTitle>
              <CardDescription>Create and configure AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/features#agent-builder">
                <Button variant="outline" className="w-full">
                  Learn more
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/features#billing">
                <Button variant="outline" className="w-full">
                  Learn more
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
