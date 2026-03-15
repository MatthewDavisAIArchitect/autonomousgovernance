import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface AnalyticsPayload {
  totalClassifications: number;
  labelCounts: {
    Conserving: number;
    "Non-Conserving": number;
    "Refusal (Terminal)": number;
  };
  refusalRate: number; // percentage, 2 decimal places
  topArtifacts: { artifactId: string; count: number }[];
  recentActivity: { date: string; count: number }[]; // last 14 days
}

export async function GET() {
  // â”€â”€ Parallel queries â€” aggregate counts only â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ANTI-PATTERN (INV-02): Never expose individual classification records.
  // All data returned is aggregate â€” no IDs, no transformation_text, no justifications.
  const [conserving, nonConserving, refusal, allRefs, recentDates] =
    await Promise.all([
      supabase
        .from("classification_records")
        .select("*", { count: "exact", head: true })
        .eq("label", "Conserving"),
      supabase
        .from("classification_records")
        .select("*", { count: "exact", head: true })
        .eq("label", "Non-Conserving"),
      supabase
        .from("classification_records")
        .select("*", { count: "exact", head: true })
        .eq("label", "Refusal (Terminal)"),
      // artifact_ref only â€” no content fields
      supabase.from("classification_records").select("artifact_ref"),
      // created_at only â€” no content fields, last 14 days
      supabase
        .from("classification_records")
        .select("created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        ),
    ]);

  const conservingCount = conserving.count ?? 0;
  const nonConservingCount = nonConserving.count ?? 0;
  const refusalCount = refusal.count ?? 0;
  const totalClassifications =
    conservingCount + nonConservingCount + refusalCount;

  // â”€â”€ Refusal rate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const refusalRate =
    totalClassifications > 0
      ? Math.round((refusalCount / totalClassifications) * 10000) / 100
      : 0;

  // â”€â”€ Top artifacts â€” aggregate counts client-side â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const refCounts: Record<string, number> = {};
  for (const row of allRefs.data ?? []) {
    const ref = row.artifact_ref as string;
    refCounts[ref] = (refCounts[ref] ?? 0) + 1;
  }
  const topArtifacts = Object.entries(refCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([artifactId, count]) => ({ artifactId, count }));

  // â”€â”€ Recent activity â€” group by date â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const dateCounts: Record<string, number> = {};
  for (const row of recentDates.data ?? []) {
    const date = (row.created_at as string).slice(0, 10); // YYYY-MM-DD
    dateCounts[date] = (dateCounts[date] ?? 0) + 1;
  }
  const recentActivity = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const payload: AnalyticsPayload = {
    totalClassifications,
    labelCounts: {
      Conserving: conservingCount,
      "Non-Conserving": nonConservingCount,
      "Refusal (Terminal)": refusalCount,
    },
    refusalRate,
    topArtifacts,
    recentActivity,
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}

