export function LoadingMessage({ label = "Ładowanie…" }: Readonly<{ label?: string }>) {
  return (
    <p role="status" aria-live="polite" className="py-8 text-center text-sm text-muted-foreground">
      {label}
    </p>
  );
}
