import { ClassificationLabel as ClassificationLabelType } from "@/lib/types";

interface ClassificationLabelProps {
  label: ClassificationLabelType;
}

const labelStyles: Record<ClassificationLabelType, string> = {
  "Conserving": "bg-label-conserving",
  "Non-Conserving": "bg-label-non-conserving",
  "Refusal (Terminal)": "bg-label-refusal",
};

export default function ClassificationLabel({ label }: ClassificationLabelProps) {
  const colorClass = labelStyles[label];
  return (
    <span className={`${colorClass} text-white font-mono text-sm px-3 py-1 border-0`}>
      {label}
    </span>
  );
}