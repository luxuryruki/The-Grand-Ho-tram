import { BedDouble, Car, MessageCircle, Zap } from "lucide-react";

const ICONS = [BedDouble, Car, MessageCircle, Zap];

export function HighlightIcon({ index }: { index: number }) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
      <Icon size={18} />
    </div>
  );
}
