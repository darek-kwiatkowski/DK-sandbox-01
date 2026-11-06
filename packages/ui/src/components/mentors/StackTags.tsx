import { Badge } from "@devmentor/ui/components/ui/badge";

/** A mentor's stack as outline tags in a named list (R13). */
export function StackTags({ tags, label = "Stack" }: Readonly<{ tags: readonly string[]; label?: string }>) {
  if (tags.length === 0) {
    return null;
  }
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="outline">{tag}</Badge>
        </li>
      ))}
    </ul>
  );
}
