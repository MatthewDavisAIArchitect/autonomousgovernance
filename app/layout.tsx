import type { Metadata } from "next";
import "./globals.css";
import NavShell from "@/components/NavShell";

export const metadata: Metadata = {
  title: "The Unified Field Theory of Autonomous Governance Project",
  description: "Governance doctrine for autonomous systems, anchored in the Conservation of Intent framework. Canonical; non-prescriptive; classification-only.",
  metadataBase: new URL("https://autonomousgovernance.org"),
  openGraph: {
    title: "The Unified Field Theory of Autonomous Governance Project",
    description: "Governance doctrine for autonomous systems, anchored in the Conservation of Intent framework. Canonical; non-prescriptive; classification-only.",
    url: "https://autonomousgovernance.org",
    siteName: "UFTAGP Research Site",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-off-white text-near-black font-sans">
        <NavShell />
        <main className="md:ml-52 ml-0 pt-14 md:pt-0" style={{ minHeight: "100vh", padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
