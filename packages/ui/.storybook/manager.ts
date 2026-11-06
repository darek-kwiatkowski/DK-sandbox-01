import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const PRODUCT = "DevMentor";

// Only the product name is visible in the Storybook UI (design system rule 10).
addons.setConfig({
  theme: create({ base: "light", brandTitle: `${PRODUCT} design system`, brandTarget: "_self" }),
  sidebar: { showRoots: true },
});

// Storybook hard-codes its name in the document title, a screen-reader heading and the
// settings menu ("About your Storybook"); replace it wherever it appears as text.
function rebrand(): void {
  if (document.title.includes("Storybook")) document.title = document.title.replaceAll("Storybook", PRODUCT);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    if (text.includes("Storybook") && node.parentElement?.tagName !== "SCRIPT") {
      node.textContent = text.replaceAll("Storybook", PRODUCT);
    }
  }
}

new MutationObserver(rebrand).observe(document, { subtree: true, childList: true, characterData: true });
