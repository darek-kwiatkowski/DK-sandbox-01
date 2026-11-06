// Polish copy for the `?error=` and `?notice=` codes of the sign-in and account pages (E01-S01 spec).
// Codes stay English (AGENTS.md); copy marked "proposal" has no fixed text in the spec yet.

export const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  github_account_exists: "Ten adres e-mail należy do konta połączonego z innym kontem GitHub.",
  github_failed: "Nie udało się zalogować przez GitHub. Spróbuj ponownie.",
  github_denied: "Logowanie przez GitHub zostało anulowane.",
  github_state: "Sesja logowania wygasła. Spróbuj ponownie.",
  github_email_mismatch: "Adres e-mail konta GitHub nie zgadza się z adresem tego konta.",
  // Proposals: the spec describes these cases without fixed copy.
  github_no_verified_email:
    "Konto GitHub nie ma zweryfikowanego głównego adresu e-mail. Zweryfikuj go na GitHub albo załóż konto z hasłem.",
  github_already_linked: "To konto GitHub jest już połączone z innym kontem DevMentor.",
  github_unavailable: "Logowanie przez GitHub jest teraz niedostępne. Zaloguj się adresem e-mail i hasłem.",
};

/** Generic message for unknown codes and server errors (E01-S01 spec: „Coś poszło nie tak…”). */
export const GENERIC_ERROR_MESSAGE = "Coś poszło nie tak. Spróbuj ponownie.";

export const AUTH_NOTICE_MESSAGES: Readonly<Record<string, string>> = {
  github_linked: "Połączyliśmy konto z GitHub. Hasło ustawione wcześniej dla tego adresu zostało usunięte.",
};

export function authErrorMessage(code: string): string {
  return AUTH_ERROR_MESSAGES[code] ?? GENERIC_ERROR_MESSAGE;
}

export function authNoticeMessage(code: string): string | null {
  return AUTH_NOTICE_MESSAGES[code] ?? null;
}
