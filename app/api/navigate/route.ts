import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import bundleData from "@/data/corpus-bundle.json";
import { PATH_CONTEXT_PREFIXES } from "@/lib/constants";
import { ReadingPath } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { message, path, history } = await request.json();

  const prioritySections = PATH_CONTEXT_PREFIXES[path as ReadingPath] || [];

  const corpusText = (bundleData.artifacts as any[]).map((artifact: any) => {
    const sections = artifact.sections as any[];
    const priority = sections.filter((s: any) =>
      prioritySections.some((p: string) => s.heading.includes(p) || s.ref.includes(p))
    );
    const rest = sections.filter((s: any) => !priority.includes(s));
    const ordered = [...priority, ...rest];
    return `=== ${artifact.id}: ${artifact.title} ===\n` +
      ordered.map((s: any) => `[${s.ref}] ${s.heading}\n${s.text}`).join("\n\n");
  }).join("\n\n");

  const systemPrompt = `You are the corpus navigation instrument for the Unified Field Theory of Autonomous Governance Project (UFTAGP).
Site jurisdiction: UFTAGP Posture B. This site derives authority from its instrument design, not from external institutional endorsement.
You have access to the full UFTAGP corpus below. Answer questions by citing artifact ID and section reference.
If a question exceeds what the corpus authorizes, state that the corpus does not address this - do not improvise.
Do not make claims beyond what the corpus explicitly states.

CORPUS:
${corpusText}`;

  const messages = [
    ...history,
    { role: "user" as const, content: message }
  ];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          const data = JSON.stringify({ type: "token", text: chunk.delta.text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    }
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}
