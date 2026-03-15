import * as fs from "fs";
import * as path from "path";

// â”€â”€ Thresholds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CORPUS_TOKEN_WARNING = 150_000;
const CORPUS_TOKEN_HARD_FAIL = 200_000;

// â”€â”€ Token estimation: ceil(chars / 4) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Conservative approximation consistent with Claude tokenisation at average
// English prose density. This is an estimate â€” the real count may differ Â±5%.
function estimateTokens(chars: number): number {
  return Math.ceil(chars / 4);
}

interface Section {
  ref: string;
  heading: string;
  text: string;
}

interface Artifact {
  id: string;
  title: string;
  curated?: boolean;
  sections: Section[];
}

interface CorpusBundle {
  artifacts: Artifact[];
}

function main(): void {
  const bundlePath = path.join("data", "corpus-bundle.json");

  // â”€â”€ Guard: bundle must exist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!fs.existsSync(bundlePath)) {
    console.error("ERROR: data/corpus-bundle.json not found. Run build-registry-bundle.ts first.");
    process.exit(1);
  }

  let bundle: CorpusBundle;
  try {
    const raw = fs.readFileSync(bundlePath, "utf-8");
    bundle = JSON.parse(raw) as CorpusBundle;
  } catch (err) {
    console.error("ERROR: Could not parse data/corpus-bundle.json:", err);
    process.exit(1);
  }

  if (!Array.isArray(bundle.artifacts)) {
    console.error("ERROR: corpus-bundle.json has no artifacts array.");
    process.exit(1);
  }

  // â”€â”€ Per-artifact breakdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let totalChars = 0;

  console.log("\nâ”€â”€ Corpus Token Audit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€");

  for (const artifact of bundle.artifacts) {
    const sections = artifact.sections ?? [];
    const artifactChars = sections.reduce((sum, s) => sum + (s.text?.length ?? 0), 0);
    const artifactTokens = estimateTokens(artifactChars);
    const curatedFlag = artifact.curated ? " [curated]" : "";

    console.log(
      `  ${artifact.id.padEnd(20)}${String(sections.length).padStart(3)} sections  ` +
      `${String(artifactChars.toLocaleString()).padStart(10)} chars  ` +
      `~${String(artifactTokens.toLocaleString()).padStart(8)} tokens${curatedFlag}`
    );

    totalChars += artifactChars;
  }

  const totalTokens = estimateTokens(totalChars);

  console.log("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€");
  console.log(
    `  ${"TOTAL".padEnd(20)}     ` +
    `${String(totalChars.toLocaleString()).padStart(10)} chars  ` +
    `~${String(totalTokens.toLocaleString()).padStart(8)} tokens`
  );
  console.log(`  Warning threshold : ${CORPUS_TOKEN_WARNING.toLocaleString()} tokens`);
  console.log(`  Hard fail         : ${CORPUS_TOKEN_HARD_FAIL.toLocaleString()} tokens`);
  console.log("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n");

  // â”€â”€ Gate evaluation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (totalTokens > CORPUS_TOKEN_HARD_FAIL) {
    console.error(
      `BUILD FAILED: Corpus exceeds hard limit.\n` +
      `  Estimated tokens : ~${totalTokens.toLocaleString()}\n` +
      `  Hard limit       : ${CORPUS_TOKEN_HARD_FAIL.toLocaleString()}\n` +
      `  Action required  : Remove or truncate sections before building.`
    );
    process.exit(1);
  }

  if (totalTokens > CORPUS_TOKEN_WARNING) {
    console.warn(
      `CORPUS_TOKEN_WARNING: Corpus is approaching the hard limit.\n` +
      `  Estimated tokens : ~${totalTokens.toLocaleString()}\n` +
      `  Warning at       : ${CORPUS_TOKEN_WARNING.toLocaleString()}\n` +
      `  Hard limit       : ${CORPUS_TOKEN_HARD_FAIL.toLocaleString()}\n` +
      `  Recommendation   : Review section counts before next Phase 2 expansion.`
    );
    // Warning does not fail the build â€” continue
    console.log("Corpus token check: WARN (build continues)\n");
    return;
  }

  console.log(`Corpus token check: PASS (~${totalTokens.toLocaleString()} tokens â€” within limits)\n`);
}

main();

