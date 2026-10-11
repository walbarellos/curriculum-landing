import { spawn } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";

async function main() {
  if (!existsSync("dist")) {
    console.error("[prerender-dist] dist directory not found");
    process.exit(1);
  }

  const port = 8092;
  const child = spawn(
    "node",
    ["scripts/with-app-env.mjs", "./node_modules/.bin/vite", "preview", "--port", String(port)],
    { stdio: "pipe" }
  );

  const cleanup = () => {
    try {
      child.kill("SIGKILL");
    } catch (_err) {
      void _err;
    }
  };

  const timer = setTimeout(() => {
    console.error("[prerender-dist] timeout waiting for preview server");
    cleanup();
    process.exit(1);
  }, 15000);

  let captured = false;

  child.stdout.on("data", async (data) => {
    const text = data.toString();
    if (text.includes(`http://127.0.0.1:${port}/`) && !captured) {
      captured = true;
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        const html = await response.text();
        writeFileSync("dist/index.html", html, "utf8");

        // Adiciona fallback SPA no _redirects se nao tiver
        const redirectsPath = "dist/_redirects";
        const redirectsContent = "/*    /index.html   200\n";
        writeFileSync(redirectsPath, redirectsContent, "utf8");

        console.log(`[prerender-dist] Generated dist/index.html (${html.length} bytes) and dist/_redirects`);
        clearTimeout(timer);
        cleanup();
        process.exit(0);
      } catch (err) {
        console.error("[prerender-dist] fetch error:", err);
        clearTimeout(timer);
        cleanup();
        process.exit(1);
      }
    }
  });

  child.stderr.on("data", (data) => {
    // apenas loga se for erro real
    const text = data.toString();
    if (text.includes("Error:") || text.includes("ENOENT")) {
      console.error("[prerender-dist stderr]:", text);
    }
  });

  child.on("exit", (code) => {
    if (!captured) {
      clearTimeout(timer);
      console.error(`[prerender-dist] preview process exited early with code ${code}`);
      process.exit(code ?? 1);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
