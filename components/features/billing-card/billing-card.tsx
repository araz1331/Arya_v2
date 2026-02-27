"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BillingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage your subscription and payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled>Coming soon</Button>
      </CardContent>
    </Card>
  );
}
