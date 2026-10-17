import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FrontendLayout, { metadata } from "./layout";

describe("marketing root layout", () => {
  it("declares the site metadata", () => {
    expect(metadata).toEqual({ title: "DevMentor", description: "Mentoring for developers." });
  });

  it("renders a Polish document around the page", () => {
    const html = renderToStaticMarkup(
      <FrontendLayout>
        <p>child</p>
      </FrontendLayout>,
    );

    expect(html).toBe(
      '<html lang="pl"><head></head><body class="min-h-svh bg-white text-slate-900 antialiased"><p>child</p></body></html>',
    );
  });
});
