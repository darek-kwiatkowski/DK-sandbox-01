import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BackendLayout, { metadata } from "./layout";

describe("backend root layout", () => {
  it("declares the panel title", () => {
    expect(metadata).toEqual({ title: "DevMentor — panel" });
  });

  it("renders a Polish document with a centered content container", () => {
    const html = renderToStaticMarkup(
      <BackendLayout>
        <p>child</p>
      </BackendLayout>,
    );

    expect(html).toBe(
      '<html lang="pl"><head></head><body class="min-h-svh antialiased"><div class="mx-auto max-w-5xl p-6"><p>child</p></div></body></html>',
    );
  });
});
