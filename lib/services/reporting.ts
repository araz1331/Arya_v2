"use server";

/**
 * Arya reporting: event logging and aggregation.
 * Uses Supabase when configured; falls back to in-memory for dev.
 */

const EVENT_TYPES = [
  "sales_email_sent",
  "sales_call_made",
  "sales_outreach_generated",
  "hr_task_created",
  "chat_message",
  "receptionist_call",
  "smm_post",
] as const;

export type AryaEventType = (typeof EVENT_TYPES)[number];
export type AryaRole = "sales" | "hr" | "chatbot" | "receptionist" | "smm";

export interface AryaEventPayload {
  [key: string]: unknown;
}

export interface AryaEvent {
  id: string;
  tenant_id?: string | null;
  event_type: AryaEventType;
  arya_role: AryaRole;
  payload: AryaEventPayload;
  created_at: string;
}

// In-memory fallback when Supabase not configured
const memoryStore: AryaEvent[] = [];
let memoryId = 0;

function getNextId(): string {
  memoryId += 1;
  return `mem-${memoryId}-${Date.now()}`;
}

export async function logEvent(
  eventType: AryaEventType,
  aryaRole: AryaRole,
  payload: AryaEventPayload,
  tenantId?: string | null
): Promise<void> {
  const event: AryaEvent = {
    id: "",
    tenant_id: tenantId ?? null,
    event_type: eventType,
    arya_role: aryaRole,
    payload,
    created_at: new Date().toISOString(),
  };

  try {
    const { getSupabaseAdmin } = await import("@/lib/services/supabase");
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("arya_events")
      .insert({
        tenant_id: tenantId ?? null,
        event_type: eventType,
        arya_role: aryaRole,
        payload,
      })
      .select("id, created_at")
      .single();

    if (!error && data) {
      return;
    }
  } catch {
    // Supabase not configured - use memory
  }

  event.id = getNextId();
  memoryStore.unshift(event);
  if (memoryStore.length > 500) memoryStore.pop();
}

export interface ReportSummary {
  sales_emails_sent: number;
  sales_calls_made: number;
  total_events: number;
  by_role: Record<string, number>;
  by_type: Record<string, number>;
}

export interface ReportFilters {
  from?: string;
  to?: string;
  role?: AryaRole;
  eventType?: AryaEventType;
  limit?: number;
}

export async function getEvents(filters: ReportFilters = {}): Promise<AryaEvent[]> {
  const { from, to, role, eventType, limit = 50 } = filters;

  try {
    const { getSupabaseAdmin } = await import("@/lib/services/supabase");
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("arya_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);
    if (role) query = query.eq("arya_role", role);
    if (eventType) query = query.eq("event_type", eventType);

    const { data, error } = await query;
    if (!error && data) return data as AryaEvent[];
  } catch {
    // Supabase not configured
  }

  let events = [...memoryStore];
  if (from) events = events.filter((e) => e.created_at >= from);
  if (to) events = events.filter((e) => e.created_at <= to);
  if (role) events = events.filter((e) => e.arya_role === role);
  if (eventType) events = events.filter((e) => e.event_type === eventType);
  return events.slice(0, limit);
}

export async function getReportSummary(filters: { from?: string; to?: string } = {}): Promise<ReportSummary> {
  const events = await getEvents({ ...filters, limit: 1000 });

  const by_role: Record<string, number> = {};
  const by_type: Record<string, number> = {};
  let sales_emails_sent = 0;
  let sales_calls_made = 0;

  for (const e of events) {
    by_role[e.arya_role] = (by_role[e.arya_role] ?? 0) + 1;
    by_type[e.event_type] = (by_type[e.event_type] ?? 0) + 1;
    if (e.event_type === "sales_email_sent") sales_emails_sent += 1;
    if (e.event_type === "sales_call_made") sales_calls_made += 1;
  }

  return {
    sales_emails_sent,
    sales_calls_made,
    total_events: events.length,
    by_role,
    by_type,
  };
}
