/* @refresh reload */
// import { monkeyWindow } from "$";
import { render } from "solid-js/web";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import { PreviewCard } from "@components/PreviewCard.tsx";
import inlineStyles from "@styles/index.css?inline";

const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5 // Cache data for 5 minutes
    }
  }
});

export function setupTailwindStyles(uniqueId: string): void {
  // Ensure we don't inject duplicate styles if the script runs multiple times
  if (typeof document === "undefined" || document.getElementById(uniqueId))
    return;

  const styleTag = document.createElement("style");
  styleTag.id = uniqueId;
  styleTag.textContent = inlineStyles;
  document.head.appendChild(styleTag);
}

function init() {
  // Query all potential article blocks on the page
  setupTailwindStyles("native-enhanced-styles");
  const articles = document.querySelectorAll(
    // 'article, .post, .entry, .search-result-item, [class*="post-"]'
    "article, .post, .entry, .search-result-item" // v1
  );

  articles.forEach(article => {
    // Avoid double injection if init runs multiple times
    if (article.querySelector(".native-enhanced-container")) return;

    // Look for target navigation post links
    const titleLink = article.querySelector(
      // 'h1 a, h2 a, h3 a, h4 a, .entry-title a, a[href*="/pes-"], a[href*="/fl25-"]'
      'h1 a, h2 a, h3 a, .entry-title a, a[href*="/pes-2021-"]' //v1
    );
    if (!(titleLink instanceof HTMLAnchorElement)) return;

    const articleUrl = titleLink.href;

    // Create a mounting base for our SolidJS element
    const container = document.createElement("div");
    container.classList.add(..."native-enhanced-container".split(" "));
    container.setAttribute("data-theme", "light");

    const lastParagraph = article.querySelector(
      "p[itemprop='articleBody'], p:last-of-type"
    );
    if (lastParagraph)
      lastParagraph.insertAdjacentElement("afterend", container);
    else article.appendChild(container);

    render(
      () => (
        <QueryClientProvider client={globalQueryClient}>
          <PreviewCard articleUrl={articleUrl} />
        </QueryClientProvider>
      ),
      container
    );
  });
}

if (document.readyState == "loading")
  document.addEventListener("DOMContentLoaded", init);
else init();
