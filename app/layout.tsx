import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "The Unified Field Theory of Autonomous Governance Project",
  description:
    "Governance doctrine for autonomous systems, anchored in the Conservation of Intent framework.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-off-white text-near-black font-sans">
        <nav className="fixed left-0 top-0 h-full w-52 border-r border-rule-grey bg-off-white z-10">
          <div className="p-6 border-b border-rule-grey">
            <p className="font-serif font-bold text-sm leading-tight text-near-black">
              The Unified Field Theory of
              <br />
              Autonomous Governance Project
            </p>
          </div>
          <ul className="p-4 space-y-1">
            <li><a href="/registry"    className="block text-sm text-near-black hover:text-accent py-1">Registry</a></li>
            <li><a href="/corpus"      className="block text-sm text-near-black hover:text-accent py-1">Corpus</a></li>
            <li><a href="/classify"    className="block text-sm text-near-black hover:text-accent py-1">Classify</a></li>
            <li><a href="/navigator"   className="block text-sm text-near-black hover:text-accent py-1">Navigate</a></li>
            <li><a href="/glossary"    className="block text-sm text-near-black hover:text-accent py-1">Glossary</a></li>
            <li><a href="/constraints" className="block text-sm text-near-black hover:text-accent py-1">Constraints</a></li>
            <li><a href="/citations"    className="block text-sm text-near-black hover:text-accent py-1">Citations</a></li>
            <li><a href="/contribute"  className="block text-sm text-near-black hover:text-accent py-1">Contribute</a></li>
            <li><a href="/about"       className="block text-sm text-near-black hover:text-accent py-1">About</a></li>
          </ul>
        </nav>
        <main style={{ marginLeft: "13rem", minHeight: "100vh", padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

