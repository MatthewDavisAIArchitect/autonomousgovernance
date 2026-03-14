import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import manifest from "@/data/registry-manifest.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const artifactCount = (manifest as { id: string; canonical?: boolean }[]).filter(
    (a) => a.canonical !== false
  ).length;

  const [invariants, classifications, members] = await Promise.all([
    supabase.from("invariant_registry").select("*", { count: "exact", head: true }),
    supabase.from("classification_records").select("*", { count: "exact", head: true }),
    supabase.from("member_registry").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json(
    {
      artifacts: artifactCount,
      invariants: invariants.count ?? 0,
      classifications: classifications.count ?? 0,
      members: members.count ?? 0,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
