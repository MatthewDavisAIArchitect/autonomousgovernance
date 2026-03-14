require("dotenv").config({ path: ".env.local" });
// @ts-ignore
import { GoogleAuth } from "google-auth-library";
import * as fs from "fs";
import * as path from "path";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;
const SERVICE_ACCOUNT = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

// ── Canonical title map — overrides Drive folder/file names ──────────────────
const TITLE_MAP: Record<string, string> = {
  "UFTAGP-SPEC-001": "Governing Specification",
  "UFTAGP-COI-001": "Conservation of Intent — Volume I: Axioms, Invariants + Admissibility",
  "UFTAGP-COI-002": "Conservation of Intent — Volume II: Intent-Domain Ontology + Transformational Relations",
  "UFTAGP-COI-003": "Conservation of Intent — Volume III: Interpretation Saturation and Limits",
};

// ── Version map ───────────────────────────────────────────────────────────────
const VERSION_MAP: Record<string, string> = {
  "UFTAGP-SPEC-001": "1.6",
  "UFTAGP-COI-001": "1.0",
  "UFTAGP-COI-002": "1.0",
  "UFTAGP-COI-003": "1.0",
};

async function getAuthToken(): Promise<string> {
  const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token!;
}

async function listFiles(token: string, folderId: string): Promise<any[]> {
  const url = `https://www.googleapis.com/drive/v3/files?q=%27${folderId}%27+in+parents+and+trashed%3Dfalse&fields=files(id,name,mimeType)`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  const files = data.files || [];
  const results: any[] = [];
  for (const file of files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      const subFiles = await listFiles(token, file.id);
      results.push(...subFiles);
    } else {
      results.push(file);
    }
  }
  return results;
}

async function exportFileAsText(token: string, fileId: string): Promise<string> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return "";
  return res.text();
}

function parseArtifactId(filename: string): string | null {
  const match = filename.match(/^(UFTAGP-[A-Z]{2,4}-\d{3})/);
  return match ? match[1] : null;
}

function chunkBySections(text: string): { ref: string; heading: string; text: string }[] {
  const lines = text.split("\n");
  const sections: { ref: string; heading: string; text: string }[] = [];
  let currentRef = "intro";
  let currentHeading = "Introduction";
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1]?.trim() || "";
    const isMarkdownHeader = line.match(/^#{1,3}\s+(.+)/);
    const isSectionRef = line.match(/^(S[\d\.]+)\s+.{3,}/);
    const isShortCaps = line.length > 3 && line.length < 80 && line === line.toUpperCase() && line.match(/[A-Z]{3,}/);
    const isHeading = isMarkdownHeader || isSectionRef || (isShortCaps && nextLine === "");

    if (isHeading) {
      if (currentLines.length > 0) {
        sections.push({ ref: currentRef, heading: currentHeading, text: currentLines.join("\n").trim() });
      }
      const heading = (isMarkdownHeader ? isMarkdownHeader[1] : line).trim();
      const refMatch = heading.match(/(S[\d\.]+)/);
      currentRef = refMatch ? refMatch[1] : heading.substring(0, 20);
      currentHeading = heading;
      currentLines = [];
    } else {
      currentLines.push(lines[i]);
    }
  }

  if (currentLines.length > 0) {
    sections.push({ ref: currentRef, heading: currentHeading, text: currentLines.join("\n").trim() });
  }

  if (sections.length === 0) {
    sections.push({ ref: "full", heading: "Full Text", text: text.trim() });
  }

  return sections;
}

async function main() {
  const token = await getAuthToken();
  const files = await listFiles(token, FOLDER_ID);

  const allDocs = files.filter((f: any) => f.mimeType === "application/vnd.google-apps.document");
  const pdfs = files.filter((f: any) => f.name.endsWith(".pdf") || f.mimeType === "application/pdf");
  const docIds = new Set(allDocs.map((f: any) => parseArtifactId(f.name)).filter(Boolean));
  const filesToProcess = [...allDocs, ...pdfs.filter((f: any) => !docIds.has(parseArtifactId(f.name)))];

  const artifacts: any[] = [];
  const manifest: any[] = [];

  for (const file of filesToProcess) {
    const artifactId = parseArtifactId(file.name);
    if (!artifactId) { console.log(`Skipping ${file.name} - no UFTAGP ID prefix`); continue; }
    console.log(`Processing ${artifactId} from ${file.name}`);
    const text = await exportFileAsText(token, file.id);
    console.log(`  Extracted ${text.length} characters`);
    const sections = chunkBySections(text);
    console.log(`  Found ${sections.length} sections`);

    const title = TITLE_MAP[artifactId] ?? file.name.replace(artifactId + "_", "").replace(/-/g, " ");
    const version = VERSION_MAP[artifactId] ?? "1.0";

    artifacts.push({ id: artifactId, title, sections });
    manifest.push({
      id: artifactId,
      title,
      type: artifactId.split("-")[1],
      status: "CANONICAL",
      version,
      canonical: true,
      zenodoDoi: null,
    });
  }

  fs.writeFileSync(path.join("data", "corpus-bundle.json"), JSON.stringify({ artifacts }, null, 2));
  fs.writeFileSync(path.join("data", "registry-manifest.json"), JSON.stringify({ artifacts: manifest }, null, 2));
  console.log(`Done. ${artifacts.length} artifacts processed.`);
}

main().catch(console.error);
