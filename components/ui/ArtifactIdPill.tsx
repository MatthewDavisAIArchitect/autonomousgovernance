import { UFTAGP_ID_REGEX } from "@/lib/constants";

interface ArtifactIdPillProps {
  id: string;
  size?: "sm" | "md";
}

export default function ArtifactIdPill({ id, size = "md" }: ArtifactIdPillProps) {
  const isValid = UFTAGP_ID_REGEX.test(id);
  const textSize = size === "sm" ? "text-xs" : "text-xs";

  if (!isValid) {
    return (
      <span className={`${textSize} font-mono px-2 py-0.5 rounded-none border border-red-800 bg-red-50 text-red-800`}>
        INVALID ID
      </span>
    );
  }

  return (
    <span className={`${textSize} font-mono px-2 py-0.5 rounded-none border border-accent bg-id-bg text-accent`}>
      {id}
    </span>
  );
}