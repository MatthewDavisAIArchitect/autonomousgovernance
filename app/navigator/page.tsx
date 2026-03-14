"use client"
// app/navigator/page.tsx
// ANTI-PATTERN GUARD: Navigator scoped refusals use font-serif italic text-mid-grey NOT label-refusal (INV-02).
// ANTI-PATTERN GUARD: Session history in React state only.
import { useState, useRef, useEffect } from "react"
import { READING_PATHS, UFTAGP_ID_REGEX } from "@/lib/constants"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"

type ReadingPath = keyof typeof READING_PATHS

interface Message { role: "user" | "assistant"; content: string; isRefusal?: boolean }

const PATH_LABELS: Record<string, string> = {
  executive: "Executive",
  architect: "Architect",
  researcher: "Researcher",
  misread: "Misread Containment",
  axiom: "Axiom Trace",
}

const PATH_DESCRIPTIONS: Record<string, string> = {
  executive: "Governance implications, mandate boundaries, citation posture",
  architect: "Semantic constraint surfaces, invariant structure, admissibility logic",
  researcher: "Doctrinal lineage, axiom derivation, ontological scope",
  misread: "Common capture patterns, prohibited citation forms, refusal triggers",
  axiom: "Step-by-step trace from axioms through invariants to classification",
}

// ── Inline segment parser — splits text on UFTAGP IDs ────────────────────────
function parseSegments(text: string): Array<{ type: "text" | "id"; value: string }> {
  const pattern = /UFTAGP-[A-Z]{2,4}-\d{3}/g
  const parts: Array<{ type: "text" | "id"; value: string }> = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) })
    parts.push({ type: "id", value: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) })
  return parts
}

// ── Render a single inline text segment with bold/italic ─────────────────────
function InlineText({ text }: { text: string }) {
  // Process **bold** and *italic* inline
  const parts: React.ReactNode[] = []
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={key++}>{text.slice(last, m.index)}</span>)
    if (m[0].startsWith("**")) {
      parts.push(<strong key={key++} className="font-semibold">{m[2]}</strong>)
    } else {
      parts.push(<em key={key++}>{m[3]}</em>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>)
  return <>{parts}</>
}

// ── Render a line with artifact ID pills and inline markdown ─────────────────
function InlineLine({ text }: { text: string }) {
  const segments = parseSegments(text)
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "id"
          ? <ArtifactIdPill key={i} id={seg.value} />
          : <InlineText key={i} text={seg.value} />
      )}
    </>
  )
}

// ── Markdown block renderer ───────────────────────────────────────────────────
function MarkdownContent({ text, isRefusal }: { text: string; isRefusal?: boolean }) {
  if (isRefusal) {
    return (
      <span className="font-serif italic text-mid-grey text-sm">
        <InlineLine text={text} />
      </span>
    )
  }

  const lines = text.split("\n")
  const nodes: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Blank line — skip
    if (line.trim() === "") { i++; continue }

    // Numbered list item: "1. text"
    if (/^\d+\.\s/.test(line)) {
      const listItems: React.ReactNode[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const content = lines[i].replace(/^\d+\.\s/, "")
        listItems.push(
          <li key={i} className="mb-1">
            <InlineLine text={content} />
          </li>
        )
        i++
      }
      nodes.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 my-2 font-serif text-sm text-near-black leading-relaxed">
          {listItems}
        </ol>
      )
      continue
    }

    // Bullet list item: "- text" or "* text"
    if (/^[-*]\s/.test(line)) {
      const listItems: React.ReactNode[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        const content = lines[i].replace(/^[-*]\s/, "")
        listItems.push(
          <li key={i} className="mb-1">
            <InlineLine text={content} />
          </li>
        )
        i++
      }
      nodes.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-2 font-serif text-sm text-near-black leading-relaxed">
          {listItems}
        </ul>
      )
      continue
    }

    // Heading: "## text"
    if (/^#{1,3}\s/.test(line)) {
      const content = line.replace(/^#{1,3}\s/, "")
      nodes.push(
        <p key={key++} className="font-serif text-sm font-semibold text-near-black mt-3 mb-1">
          <InlineLine text={content} />
        </p>
      )
      i++
      continue
    }

    // Regular paragraph
    nodes.push(
      <p key={key++} className="font-serif text-sm text-near-black leading-relaxed mb-2">
        <InlineLine text={line} />
      </p>
    )
    i++
  }

  return <>{nodes}</>
}

export default function NavigatorPage() {
  const [activePath, setActivePath] = useState<ReadingPath | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  async function sendMessage(text: string, path?: ReadingPath, history?: Message[]) {
    const usePath = path ?? activePath
    if (!usePath || !text.trim() || streaming) return
    const useHistory = history ?? messages
    const userMsg: Message = { role: "user", content: text }
    const newHistory = [...useHistory, userMsg]
    setMessages(newHistory)
    setInput("")
    setStreaming(true)

    let assistantText = ""
    setMessages([...newHistory, { role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          path: usePath,
          history: useHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("No stream")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split("\n")
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const raw = line.slice(6).trim()
          if (!raw) continue
          try {
            const evt = JSON.parse(raw)
            if (evt.type === "token") {
              assistantText += evt.text
              setMessages([...newHistory, { role: "assistant", content: assistantText }])
            } else if (evt.type === "done") {
              setMessages([...newHistory, { role: "assistant", content: assistantText, isRefusal: evt.isRefusal ?? false }])
            }
          } catch {}
        }
      }
    } catch {
      setMessages([...newHistory, { role: "assistant", content: "Stream error." }])
    } finally {
      setStreaming(false)
    }
  }

  if (!activePath) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-2xl text-near-black mb-2">Corpus Navigator</h1>
        <p className="font-sans text-sm text-mid-grey mb-8">Select a reading path to begin.</p>
        <div className="border-t border-rule-grey">
          {Object.keys(PATH_LABELS).map((p) => (
            <button
              key={p}
              onClick={() => { setActivePath(p as ReadingPath); setMessages([]); sendMessage("Begin", p as ReadingPath, []) }}
              className="w-full text-left border-b border-rule-grey py-5 group bg-transparent hover:bg-transparent"
            >
              <p className="font-serif text-base text-near-black group-hover:text-accent transition-colors">{PATH_LABELS[p]}</p>
              <p className="font-sans text-xs text-mid-grey mt-1">{PATH_DESCRIPTIONS[p]}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      <div className="flex items-baseline gap-4 pb-4 border-b border-rule-grey mb-4 shrink-0">
        <h1 className="font-serif text-lg text-near-black">{PATH_LABELS[activePath]}</h1>
        <button onClick={() => { setActivePath(null); setMessages([]) }} className="font-sans text-xs text-mid-grey hover:text-accent">
          ← paths
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "pl-8" : ""}>
            {m.role === "user"
              ? <p className="font-sans text-sm text-mid-grey">{m.content}</p>
              : <MarkdownContent text={m.content} isRefusal={m.isRefusal} />
            }
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-rule-grey pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            disabled={streaming}
            placeholder="Ask about the corpus..."
            className="flex-1 font-serif text-sm border border-rule-grey bg-off-white px-3 py-2 rounded-none focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={streaming || !input.trim()}
            className="font-sans text-sm text-off-white bg-near-black px-4 py-2 rounded-none hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
