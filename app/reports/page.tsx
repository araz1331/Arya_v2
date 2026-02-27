"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Mail,
  Phone,
  MessageCircle,
  Users,
  Megaphone,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvents, getReportSummary, type AryaEvent, type AryaRole } from "@/lib/services/reporting";

const ROLE_LABELS: Record<string, string> = {
  sales: "Sales",
  hr: "HR",
  chatbot: "Chatbot",
  receptionist: "Receptionist",
  smm: "SMM",
};

const EVENT_LABELS: Record<string, string> = {
  sales_email_sent: "Email sent",
  sales_call_made: "Call made",
  sales_outreach_generated: "Outreach generated",
  hr_task_created: "HR task",
  chat_message: "Chat message",
  receptionist_call: "Receptionist call",
  smm_post: "SMM post",
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  sales: Mail,
  hr: Users,
  chatbot: MessageCircle,
  receptionist: Phone,
  smm: Megaphone,
};

export default function ReportsPage() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getReportSummary>> | null>(null);
  const [events, setEvents] = useState<AryaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<AryaRole | "all">("all");
  const [daysFilter, setDaysFilter] = useState(7);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const to = new Date().toISOString();
      const from = new Date(Date.now() - daysFilter * 24 * 60 * 60 * 1000).toISOString();

      const [s, e] = await Promise.all([
        getReportSummary({ from, to }),
        getEvents({
          from,
          to,
          role: roleFilter === "all" ? undefined : roleFilter,
          limit: 100,
        }),
      ]);
      setSummary(s);
      setEvents(e);
      setLoading(false);
    }
    load();
  }, [roleFilter, daysFilter]);

  return (
    <div role="main" className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-xl font-semibold">Arya Reports</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Activity & Reporting</h2>
          <p className="mt-2 text-white/60">
            Track all Arya activities: Sales, HR, Chatbot, Receptionist, SMM
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-white/60" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as AryaRole | "all")}
              className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
            >
              <option value="all">All roles</option>
              {Object.entries(ROLE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    Emails Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary?.sales_emails_sent ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4 text-blue-400" />
                    Calls Made
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary?.sales_calls_made ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-indigo-400" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary?.total_events ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">By Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {Object.entries(summary?.by_role ?? {}).map(([role, count]) => (
                      <div key={role} className="flex justify-between">
                        <span className="text-white/70">{ROLE_LABELS[role] ?? role}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                    {(!summary?.by_role || Object.keys(summary.by_role).length === 0) && (
                      <p className="text-white/50">No activity yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event list */}
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-white/60">
                  All Arya events in the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="py-12 text-center text-white/50">
                    No events yet. Send an email or make a call from Sales Arya to see activity.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => {
                      const Icon = ROLE_ICONS[event.arya_role] ?? BarChart3;
                      return (
                        <div
                          key={event.id}
                          className="flex items-start gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                            <Icon className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">
                              {EVENT_LABELS[event.event_type] ?? event.event_type}
                            </p>
                            <p className="text-sm text-white/60">
                              {ROLE_LABELS[event.arya_role] ?? event.arya_role} ·{" "}
                              {new Date(event.created_at).toLocaleString()}
                            </p>
                            {event.payload && Object.keys(event.payload).length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {"to" in event.payload && (
                                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
                                    to: {String(event.payload.to)}
                                  </span>
                                )}
                                {"subject" in event.payload && (
                                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
                                    {String(event.payload.subject).slice(0, 40)}...
                                  </span>
                                )}
                                {"callSid" in event.payload && (
                                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
                                    SID: {String(event.payload.callSid).slice(0, 12)}...
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8">
              <Link href="/agent/sales">
                <Button variant="outline" className="border-white/20 text-white/90">
                  Go to Sales Arya
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
