import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const TITLE = "Willian Albarello — Desenvolvedor de Sistemas";
const DESC =
  "Portfólio de Willian Albarello. Apps de acessibilidade digital, CAA, Android nativo e ferramentas de sistemas em Linux/C++. Rio Branco, Acre.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#f6f4ef", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#121314", media: "(prefers-color-scheme: dark)" },
      // Compartilhamento (troque /og.png por uma imagem 1200×630 quando tiver)
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: "/og.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "/og.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      // Fontes sem bloquear a renderização (antes era @import no CSS)
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@500;600&family=JetBrains+Mono:wght@400;600&family=Heebo:wght@400;700;800&family=Frank+Ruhl+Libre:wght@500;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    // O script do Capi (/js/acessibilidade.js) agora é carregado uma única vez,
    // em components/portfolio.tsx, junto com o init({ libras: false }).
  }),
  component: () => (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
