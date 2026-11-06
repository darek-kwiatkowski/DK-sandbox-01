"use client";

import { useState } from "react";

import { apiCall } from "@devmentor/ui/backend/api";
import { Button } from "@devmentor/ui/components/ui/button";
import { FieldDescription } from "@devmentor/ui/components/ui/field";

export interface SignOutButtonProps {
  /** Where to go after the session is revoked. */
  redirectTo?: string;
  /** Full navigation, so server components see the cleared cookie (E01-S01 spec). Injected in tests. */
  navigate?: (path: string) => void;
}

/** „Wyloguj się” for every device: POST /api/auth/logout, then a full navigation (E01-S01 spec). */
export function SignOutButton({
  redirectTo = "/login",
  navigate = (path) => window.location.assign(path),
}: Readonly<SignOutButtonProps>) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setIsSigningOut(true);
    setError(null);
    const result = await apiCall<null>("/api/auth/logout", { method: "POST" });
    if (result.ok) {
      navigate(redirectTo);
      return;
    }
    // Never claim a global sign-out that did not happen (E01-S01 spec, logout infrastructure failure).
    setError(result.error.message);
    setIsSigningOut(false);
  }

  return (
    <div className="flex flex-col items-start gap-in-group">
      <Button
        type="button"
        variant="outline"
        onClick={signOut}
        disabled={isSigningOut}
        aria-busy={isSigningOut || undefined}
        aria-describedby="sign-out-hint"
      >
        {isSigningOut ? "Wylogowywanie…" : "Wyloguj się"}
      </Button>
      <FieldDescription id="sign-out-hint">Wylogujemy Cię na wszystkich urządzeniach.</FieldDescription>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
