Let's address both issues sequentially: fixing why the Gemini script fails to keep your chat in temporary mode, and ensuring your localized development userscript automatically deactivates your production variant when active.

---

### Issue 1: Fixing the Gemini Auto-Temp Logic

Your script currently looks for text variations like `"temporary"` or `"temp chat"` on button elements. In modern variants of Google Gemini, the temporary chat controller is an anchor link (`<a>`), a menu list item, or an element nested deep inside a generic button wrapper. Additionally, checking `btn.innerText` or `aria-label` directly on the outer element can miss the target if the text is inside a nested `span` or `div`.

Furthermore, your loop triggers immediately on `DOMContentLoaded`, but Gemini relies heavily on delayed client-side data streaming to render its navigation panel elements.

Let's refactor `apps/gemini-auto-temp/src/index.ts` to use a broad selector query targeting any element containing the text phrase or matching attributes, backed by a persistent **`MutationObserver`**. This ensures the moment Gemini finishes streaming its DOM elements, your script immediately detects the target widget and acts on it.

Replace `apps/gemini-auto-temp/src/index.ts` with the following optimized logic:

```typescript
/* @refresh reload */
let clicked = false;

function clickTempChat(): boolean {
  if (clicked) return true;

  // Modern apps wrap these buttons inside specific container trees or link elements
  const interactiveElements = document.querySelectorAll(
    "button, a, [role='button'], [role='menuitem']"
  );

  for (const element of interactiveElements) {
    const text = (element.textContent || "").toLowerCase();
    const ariaLabel = (element.getAttribute("aria-label") || "").toLowerCase();
    const testId = (element.getAttribute("data-testid") || "").toLowerCase();

    if (
      text.includes("temporary") ||
      text.includes("temp chat") ||
      ariaLabel.includes("temporary") ||
      ariaLabel.includes("temp") ||
      testId.includes("temp")
    ) {
      // Direct clicks can sometimes fail on styled custom elements; dispatch an explicit event
      console.log(
        "🎯 Found temporary chat action layer. Initializing simulation trigger..."
      );

      const targetElement = element as HTMLElement;
      targetElement.click();
      clicked = true;
      return true;
    }
  }
  return false;
}

// Observe the layout continuously so the moment Gemini mounts the sidebar, the script clicks it
function initObserver(): void {
  if (clickTempChat()) return;

  const observer = new MutationObserver((_, obs) => {
    if (clickTempChat()) {
      obs.disconnect(); // Terminate observer once clicked to reclaim memory footprint
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Fail-safe teardown after 10 seconds to prevent lingering loop overhead
  setTimeout(() => observer.disconnect(), 10000);
}

function setupHotkeys(): void {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "o") {
      event.preventDefault();
      console.log(
        "Hotkey Ctrl+Shift+O detected. Retrying layout interception..."
      );

      clicked = false;
      initObserver();
    }
  });
}

function init(): void {
  initObserver();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
setupHotkeys();
```

---

### Issue 2: Autodisable Production Script when in Dev Mode

When running `pnpm dev`, `vite-plugin-monkey` injects a dev wrapper script pointing to your localhost endpoint. If your production userscript is also active, both run concurrently, causing race conditions and logic duplication.

We can solve this cleanly by exploiting Tampermonkey’s script loading execution sequence via **global variable flag mapping**.

* **Dev Environment Scripts** will declare a specific globally scoped string or boolean variable immediately on load.
* **Production Build Scripts** will check for the existence of this window flag. If it evaluates to `true`, the production instance will abort execution instantly.

#### Step A: Update `apps/gemini-auto-temp/vite.config.ts`

We need to inject a different compilation flag depending on whether Vite is running a development server (`command === 'serve'`) or building for production (`command === 'build'`).

Update your `vite.config.ts` to accept the Vite conditional configuration context:

```typescript
import { defineConfig } from "vite";

import { createViteConfig } from "@repo/vite-config";

import pkg from "./package.json" with { type: "json" };

export default defineConfig(({ command }) => {
  return createViteConfig(
    {
      framework: "vanilla",
      server: { mountGmApi: true },
      entry: "src/index.ts",
      userscript: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        homepageURL: pkg.homepage,
        author: `[${pkg.author.name}](${pkg.author.url})`,
        namespace: "npm/vite-plugin-monkey",
        match: ["https://gemini.google.com/*"],
        grant: "none"
      }
    },
    {
      // Pass custom bundle-level replacement macros
      define: { __IS_DEV__: command === "serve" }
    }
  );
});
```

*Note: Since you are updating this pattern, ensure that your shared package configuration `packages/vite-config/index.ts` passes through additional configurations cleanly.* Update your shared utility file to ensure override options merge flawlessly:

```typescript
// packages/vite-config/index.ts
import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import monkey, { MonkeyOption } from "vite-plugin-monkey";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "vite-plugin-tailwind";
import tsconfigPaths from "vite-tsconfig-paths";

interface CustomViteOptions extends MonkeyOption {
  framework?: "solid" | "vanilla";
}

export function createViteConfig(
  options: CustomViteOptions,
  overrides: Partial<UserConfig> = {}
): UserConfig {
  const { framework = "solid", ...monkeyOptions } = options;
  const plugins: UserConfig["plugins"] = [
    ...(framework === "solid" ? [solidPlugin()] : []),
    {
      name: "set-headers",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Access-Control-Request-Private-Network", "true");
          res.setHeader("Access-Control-Allow-Private-Network", "true");
          res.setHeader("Access-Control-Allow-Origin", "*");
          next();
        });
      }
    },
    tsconfigPaths(),
    tailwindcss(),
    monkey(monkeyOptions)
  ];
  return defineConfig({
    plugins,
    ...overrides // Merge local definitions
  });
}
```

#### Step B: Declare types for the new global flags

Create or update a type mapping declaration inside `apps/gemini-auto-temp/src/vite-env.d.ts` so TypeScript understands the global constants:

```typescript
/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />

declare const __IS_DEV__: boolean;

interface Window {
  __GEMINI_AUTO_TEMP_DEV_ACTIVE__?: boolean;
}
```

#### Step C: Intercept execution inside `apps/gemini-auto-temp/src/index.ts`

Now, wrap the `init()` sequence to toggle the flag in development mode or read it in production mode. Add this guarding interception block to the absolute top of your script execution loop:

```typescript
// Enforce Dev vs Production isolation mapping
if (typeof window !== "undefined") {
  if (__IS_DEV__) {
    console.log(
      "🛠️ Dev Server userscript active. Injecting disable-signal for production versions."
    );
    window.__GEMINI_AUTO_TEMP_DEV_ACTIVE__ = true;
  } else if (window.__GEMINI_AUTO_TEMP_DEV_ACTIVE__) {
    console.warn(
      "🚫 Production Gemini Auto-Temp disabled: Local development server script is active."
    );
    // Force abort execution
    throw new Error("Local environment script override active.");
  }
}

// ... Rest of the clickTempChat() and initObserver() code goes here ...
```

### Why this setup is robust

1. If you are browsing Gemini normally, `window.__GEMINI_AUTO_TEMP_DEV_ACTIVE__` is `undefined`, so your production script runs exactly as normal.
2. The moment you execute `pnpm dev:gemini` or use your `gum menu`, the injected development file launches, sets `window.__GEMINI_AUTO_TEMP_DEV_ACTIVE__ = true`, and your production code automatically aborts execution with zero manual script management inside Tampermonkey required. Use this same pattern for your `pes-files-fetch` application!
