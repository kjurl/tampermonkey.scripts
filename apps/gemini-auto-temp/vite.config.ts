import { createViteConfig } from "@repo/vite-config";

import pkg from "./package.json" with { type: "json" };

export default createViteConfig({
  framework: "vanilla",
  server: { mountGmApi: true },
  entry: "src/index.ts",
  userscript: {
    name: pkg.displayName,
    description: pkg.description,
    version: pkg.version,
    homepageURL: pkg.homepage,
    author: `[${pkg.author.name}](${pkg.author.url})`,
    namespace: "npm/vite-plugin-monkey",
    match: ["https://gemini.google.com/*"],
    grant: "none"
  }
});
