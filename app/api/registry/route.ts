import { NextRequest, NextResponse } from "next/server";
import manifestData from "@/data/registry-manifest.json";
import { UFTAGP_ID_REGEX } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ artifacts: manifestData.artifacts });
  }

  if (!UFTAGP_ID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid artifact ID format" }, { status: 400 });
  }

  const artifact = manifestData.artifacts.find((a: any) => a.id === id);
  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  return NextResponse.json({ artifact });
}
