import { useCallback, useEffect, useState } from "react";
import { apiCall } from "./apiCall";
import type { ApiError } from "./types";

export type ApiResourceState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "ready"; data: T };

/** Loads `GET path` through `apiCall` for client components; `reload()` refetches. */
export function useApiResource<T>(path: string): ApiResourceState<T> & { reload: () => void } {
  const [state, setState] = useState<ApiResourceState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    apiCall<T>(path, { signal: controller.signal }).then(
      (result) => setState(result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error }),
      (error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          throw error;
        }
      },
    );
    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, reload };
}
