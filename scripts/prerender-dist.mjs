import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

async function main() {
  const serverEntry = resolve(".netlify/functions-internal/server/main.mjs");
  if (!existsSync(serverEntry)) {
    console.error("[prerender-dist] server entry not found:", serverEntry);
    process.exit(1);
  }

  try {
    const { default: handler } = await import(serverEntry);
    const response = await handler(new Request("http://localhost/"));
    if (response.status !== 200) {
      console.error(`[prerender-dist] unexpected status: ${response.status}`);
      process.exit(1);
    }
    const html = await response.text();
    writeFileSync("dist/index.html", html, "utf8");
    console.log(`[prerender-dist] Successfully generated dist/index.html (${html.length} bytes)`);

    mkdirSync("dist/__grok", { recursive: true });
    if (existsSync("public/__grok/manifest.webmanifest")) {
      copyFileSync("public/__grok/manifest.webmanifest", "dist/__grok/manifest.webmanifest");
    }
    if (existsSync("public/__grok/manifest.json")) {
      copyFileSync("public/__grok/manifest.json", "dist/__grok/manifest.json");
    }
  } catch (err) {
    console.error("[prerender-dist] error:", err);
    process.exit(1);
  }
}

main();
