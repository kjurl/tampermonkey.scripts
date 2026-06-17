import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const stagingDir = path.join(rootDir, ".dist-staging");

// Ensure staging directory is clean and exists
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Define the apps you want to track
const apps = [
  {
    dir: "apps/gemini-auto-temp",
    buildName: "gemini-auto-temp" // Make sure this matches the file name vite-plugin-monkey outputs
  },
  { dir: "apps/pes-files-fetch", buildName: "pes-files-fetch" }
];

apps.forEach(({ dir, buildName }) => {
  const pkgPath = path.join(rootDir, dir, "package.json");
  const distPath = path.join(rootDir, dir, "dist");

  if (!fs.existsSync(pkgPath) || !fs.existsSync(distPath)) return;

  // Read current version handled by Changesets
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const version = pkg.version;

  const sourceFile = path.join(distPath, `${buildName}.user.js`);

  if (fs.existsSync(sourceFile)) {
    // 1. Copy as the static update file
    fs.copyFileSync(sourceFile, path.join(stagingDir, `${buildName}.user.js`));

    // 2. Copy as the versioned archive file
    fs.copyFileSync(
      sourceFile,
      path.join(stagingDir, `${buildName}-v${version}.user.js`)
    );

    console.log(`✅ Staged ${buildName} (v${version})`);
  }
});
