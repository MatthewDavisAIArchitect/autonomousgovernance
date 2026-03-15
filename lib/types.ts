export type ArtifactType = "COI" | "WP" | "SPEC" | "AXM" | "ONT";
export type ArtifactStatus = "CANONICAL" | "SUPERSEDED" | "DRAFT";

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  status: ArtifactStatus;
  version: string;
  driveId: string;
  zenodoDoi: string | null;
  publishedDate: string | null;
  canonical: boolean;
}

export type ClassificationLabel = "Conserving" | "Non-Conserving" | "Refusal (Terminal)";

export interface MinimalClassificationRecord {
  artifactRef: string;
  intentBasisRef: string[];
  statedTransformation: string;
  label: ClassificationLabel;
  finiteJustification: string;
  refusalTrigger: string | null;
}

export interface CommunitySubmission {
  zenodoId: string;
  doi: string;
  title: string;
  authors: string[];
  abstract: string;
  affiliatedDate: string;
  voteCount: number;
  communityRank: number;
  transformationClass: string;
  mcrAttached: boolean;
}

export type ReadingPath = "executive" | "architect" | "researcher" | "misread" | "axiom";

export interface NavigatorRequest {
  message: string;
  path: ReadingPath;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface SiteStats {
  artifacts: number;
  invariants: number;
  classifications: number;
  members: number;
}