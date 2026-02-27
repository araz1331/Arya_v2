import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div role="main" className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Arya</h1>
        <p className="text-muted-foreground">
          AI employee platform for SMEs. Start with Sales Arya—find buyers, contact, converse, close.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/agent/sales">
            <Button className="bg-indigo-600 hover:bg-indigo-500">Sales Arya</Button>
          </Link>
          <Link href="/agent/sales?tab=selfsale">
            <Button variant="outline">Sell Arya</Button>
          </Link>
          <Link href="/features">
            <Button variant="outline">All Features</Button>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Sales Arya</CardTitle>
              <CardDescription>Find prospects, outreach, handle objections, close deals—any industry. Plus: Arya sells Arya.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agent/sales">
                <Button className="w-full">Launch Sales Agent</Button>
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
