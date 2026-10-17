import { Button } from "@devmentor/ui/components/ui/button";

export function ErrorMessage({
  message = "Nie udało się wczytać danych.",
  onRetry,
}: Readonly<{ message?: string; onRetry?: () => void }>) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Spróbuj ponownie
        </Button>
      ) : null}
    </div>
  );
}
