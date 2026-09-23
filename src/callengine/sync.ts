// Every M-POWER CALL is written to the database as well as the local store,
// so the operator and the admin see the same record from any device.
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { CallRecord } from "./types";

export async function pushCallRecord(r: CallRecord): Promise<{ ok: boolean; error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const row = {
    called_at: r.ts,
    operator_id: auth.user?.id ?? null,
    operator_name: r.operatorName ?? null,
    lead_ulid: r.ulid ?? null,
    canonical_id: r.canonicalId ?? null,
    customer_name: r.name ?? null,
    agenda: r.agenda,
    agenda_source: r.agendaSource ?? null,
    outcome: r.outcome,
    duration_sec: r.durationSec ?? null,
    capture: r.capture as unknown as Json,
    movement: r.movement ?? null,
    message_now: r.messageNow ?? null,
    message_sent: !!r.messageSent,
    follow_up: r.followUp as unknown as Json,
    follow_up_state: r.followUpState ?? null,
    next_step: r.nextStep as unknown as Json,
    stage_after: r.stageAfter ?? null,
    waste: (r.waste ?? []) as unknown as Json,
    client_id: r.id,
  };
  const { error } = await supabase.from("call_records").insert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Calls stored centrally — used by the admin view and by the operator's own history. */
export async function fetchCallRecords(limit = 200): Promise<CallRecord[]> {
  const { data, error } = await supabase
    .from("call_records")
    .select("*")
    .order("called_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.client_id ?? row.id,
    ts: row.called_at,
    ulid: row.lead_ulid ?? "",
    canonicalId: row.canonical_id ?? "",
    name: row.customer_name ?? "Unknown customer",

    operatorId: row.operator_id ?? "",
    operatorName: row.operator_name ?? "Unknown operator",

    agenda: row.agenda as CallRecord["agenda"],
    agendaSource: row.agenda_source as CallRecord["agendaSource"],
    outcome: row.outcome as CallRecord["outcome"],
    durationSec: row.duration_sec ?? 0,

    capture: (row.capture ?? {}) as unknown as CallRecord["capture"],

    movement: (row.movement ?? "none") as CallRecord["movement"],

    messageNow: row.message_now ?? "",
    messageSent: row.message_sent ?? false,

    followUp: (row.follow_up ?? {}) as unknown as CallRecord["followUp"],
    followUpState: row.follow_up_state as CallRecord["followUpState"],

    nextStep: (row.next_step ?? {}) as unknown as CallRecord["nextStep"],
    stageAfter: row.stage_after ?? "",

    waste: Array.isArray(row.waste)
      ? (row.waste as string[])
      : [],
  }));
}