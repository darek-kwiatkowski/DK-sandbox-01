import { CircleAlert, Info } from "lucide-react";

import { Alert, AlertDescription } from "@devmentor/ui/components/ui/alert";

import { authErrorMessage, authNoticeMessage } from "./auth-messages";

/**
 * Shows the message for `?error=` or `?notice=` after a redirect (E01-S01 spec). Errors are announced
 * at once (role alert), notices politely (role status). Renders nothing without a known code.
 */
export function AuthMessage({ error, notice }: Readonly<{ error?: string | null; notice?: string | null }>) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertDescription>{authErrorMessage(error)}</AlertDescription>
      </Alert>
    );
  }
  const message = notice ? authNoticeMessage(notice) : null;
  if (!message) {
    return null;
  }
  return (
    <Alert role="status">
      <Info aria-hidden="true" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
