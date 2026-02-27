"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AgentBuilderCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Builder</CardTitle>
        <CardDescription>Create and configure your AI hiring agent</CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled>Coming soon</Button>
      </CardContent>
    </Card>
  );
}
