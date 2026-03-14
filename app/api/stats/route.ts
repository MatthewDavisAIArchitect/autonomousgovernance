import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const [artifacts, invariants, classifications, members] = await Promise.all([
    supabase.from("artifact_registry").select("*", { count: "exact", head: true }).eq("canonical", true),
    supabase.from("invariant_registry").select("*", { count: "exact", head: true }),
    supabase.from("classification_records").select("*", { count: "exact", head: true }),
    supabase.from("member_registry").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json(
    {
      artifacts: artifacts.count ?? 0,
      invariants: invariants.count ?? 0,
      classifications: classifications.count ?? 0,
      members: members.count ?? 0,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
