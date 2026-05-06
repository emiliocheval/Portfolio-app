import { getTagPillProps } from "@/lib/tech-icons";

export function TagPill({ name }: { name: string }) {
  const { color, Icon } = getTagPillProps(name);
  const dim = color === "#FAFAFA" || color === "#FFFFFF" || color === "#F7DF1E";

  return (
    <span
      className="inline-flex max-w-[min(100%,12.5rem)] min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: `${color}55`,
        backgroundColor: `${color}18`,
        color: dim ? "#e4e4e7" : color,
        boxShadow: `0 0 20px -6px ${color}44`,
      }}
      title={name}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
      <span className="min-w-0 truncate">{name}</span>
    </span>
  );
}
