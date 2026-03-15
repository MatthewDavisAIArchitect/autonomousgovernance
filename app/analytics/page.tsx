"use client";
// app/analytics/page.tsx
// Aggregate classification analytics â€” law-review register display.
// ANTI-PATTERN (INV-02): No sealed color classes here. No Chart.js. No individual records.
import { useEffect, useState } from "react";
import type { AnalyticsPayload } from "@/app/api/analytics/route";

const EMPTY: AnalyticsPayload = {
  totalClassifications: 0,
  labelCounts: { Conserving: 0, "Non-Conserving": 0, "Refusal (Terminal)": 0 },
  refusalRate: 0,
  topArtifacts: [],
  recentActivity: [],
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<AnalyticsPayload>;
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-2">
        Classification Analytics
      </h1>
      <p className="font-sans text-sm text-mid-grey mb-8">
        Aggregate counts from the classification register. No individual records
        are exposed.
      </p>

      {error && (
        <p className="font-mono text-xs text-mid-grey border border-rule-grey px-4 py-3 mb-8">
          Error loading analytics: {error}
        </p>
      )}

      {/* â”€â”€ Summary counts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mb-10">
        <h2 className="font-sans text-xs text-mid-grey uppercase tracking-widest mb-4">
          Summary
        </h2>
        <div className="border-t border-rule-grey">
          <div className="border-b border-rule-grey py-4 flex justify-between items-baseline">
            <span className="font-sans text-sm text-near-black">
              Total classifications
            </span>
            <span className="font-mono text-sm text-near-black">
              {loading ? "â€”" : data.totalClassifications.toLocaleString()}
            </span>
          </div>
          <div className="border-b border-rule-grey py-4 flex justify-between items-baseline">
            <span className="font-sans text-sm text-near-black">
              Refusal rate
            </span>
            <span className="font-mono text-sm text-near-black">
              {loading ? "â€”" : `${data.refusalRate.toFixed(2)}%`}
            </span>
          </div>
        </div>
      </section>

      {/* â”€â”€ Label distribution â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mb-10">
        <h2 className="font-sans text-xs text-mid-grey uppercase tracking-widest mb-4">
          Label Distribution
        </h2>
        <div className="border-t border-rule-grey">
          {(
            [
              "Conserving",
              "Non-Conserving",
              "Refusal (Terminal)",
            ] as const
          ).map((label) => {
            const count = loading ? null : data.labelCounts[label];
            const pct =
              !loading && data.totalClassifications > 0
                ? (
                    (data.labelCounts[label] / data.totalClassifications) *
                    100
                  ).toFixed(1)
                : null;
            return (
              <div
                key={label}
                className="border-b border-rule-grey py-4 flex justify-between items-baseline"
              >
                <span className="font-sans text-sm text-near-black">
                  {label}
                </span>
                <span className="font-mono text-sm text-near-black tabular-nums">
                  {loading
                    ? "â€”"
                    : `${(count ?? 0).toLocaleString()}${pct !== null ? `  (${pct}%)` : ""}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Top artifacts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mb-10">
        <h2 className="font-sans text-xs text-mid-grey uppercase tracking-widest mb-4">
          Top Artifacts by Classification Volume
        </h2>
        <div className="border-t border-rule-grey">
          {loading ? (
            <div className="border-b border-rule-grey py-4">
              <span className="font-mono text-xs text-mid-grey">
                Loadingâ€¦
              </span>
            </div>
          ) : data.topArtifacts.length === 0 ? (
            <div className="border-b border-rule-grey py-4">
              <span className="font-mono text-xs text-mid-grey">
                No classifications recorded.
              </span>
            </div>
          ) : (
            data.topArtifacts.map(({ artifactId, count }, i) => (
              <div
                key={artifactId}
                className="border-b border-rule-grey py-4 flex justify-between items-baseline"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-mid-grey w-4">
                    {i + 1}.
                  </span>
                  <span className="font-mono text-xs text-near-black">
                    {artifactId}
                  </span>
                </div>
                <span className="font-mono text-sm text-near-black tabular-nums">
                  {count.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* â”€â”€ Recent activity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mb-10">
        <h2 className="font-sans text-xs text-mid-grey uppercase tracking-widest mb-4">
          Recent Activity (last 14 days)
        </h2>
        <div className="border-t border-rule-grey">
          {loading ? (
            <div className="border-b border-rule-grey py-4">
              <span className="font-mono text-xs text-mid-grey">
                Loadingâ€¦
              </span>
            </div>
          ) : data.recentActivity.length === 0 ? (
            <div className="border-b border-rule-grey py-4">
              <span className="font-mono text-xs text-mid-grey">
                No activity in the last 14 days.
              </span>
            </div>
          ) : (
            data.recentActivity.map(({ date, count }) => (
              <div
                key={date}
                className="border-b border-rule-grey py-4 flex justify-between items-baseline"
              >
                <span className="font-mono text-xs text-near-black">
                  {date}
                </span>
                <span className="font-mono text-sm text-near-black tabular-nums">
                  {count.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

