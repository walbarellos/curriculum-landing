import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const TITLE = "Willian Albarello — Desenvolvedor de Sistemas";
const DESC =
  "Portfólio de Willian Albarello. Apps de acessibilidade digital, CAA, Android nativo e ferramentas de sistemas em Linux/C++. Rio Branco, Acre.";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://walbarellos.is-a.dev/#person",
      name: "Willian Albarello",
      givenName: "Willian",
      familyName: "Albarello",
      url: "https://walbarellos.is-a.dev",
      image: "https://walbarellos.is-a.dev/img/perfil.jpg",
      jobTitle: "Desenvolvedor de Sistemas & Engenheiro de Software",
      description:
        "Desenvolvedor de sistemas com foco em acessibilidade digital (CAA), Android nativo, ferramentas de sistemas em Linux/C++ e plataformas cívicas.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rio Branco",
        addressRegion: "AC",
        addressCountry: "BR",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Instituto Federal do Acre (IFAC)",
      },
      sameAs: [
        "https://github.com/walbarellos",
        "https://www.linkedin.com/in/willian-albarello-b96361103/",
        "http://lattes.cnpq.br/1326474169012655",
        "https://mastodon.social/@walbarellos",
      ],
      knowsAbout: [
        "TypeScript",
        "React",
        "Python",
        "Android SDK & Kotlin",
        "C & C++",
        "Acessibilidade Digital (WCAG, LBI)",
        "Comunicação Alternativa e Aumentativa (CAA)",
        "Linux & Wayland",
        "PostgreSQL",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": "https://walbarellos.is-a.dev/#profilepage",
      url: "https://walbarellos.is-a.dev/",
      name: "Willian Albarello — Portfólio & Currículo Interativo",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://walbarellos.is-a.dev/#website",
        name: "Willian Albarello",
        url: "https://walbarellos.is-a.dev",
      },
      about: { "@id": "https://walbarellos.is-a.dev/#person" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://walbarellos.is-a.dev/og.jpg",
      },
      inLanguage: ["pt-BR", "en", "es", "fr", "he"],
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Willian Albarello, desenvolvedor de sistemas, engenheiro de software, acessibilidade digital, CAA, Android nativo, Kotlin, Python, C++, Linux, Wayland, Rio Branco, Acre, portfólio, currículo",
      },
      { name: "author", content: "Willian Albarello" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "theme-color", content: "#f6f4ef", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#121314", media: "(prefers-color-scheme: dark)" },
      // Open Graph (WhatsApp / LinkedIn / Facebook)
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: "https://walbarellos.is-a.dev/" },
      { property: "og:site_name", content: "Willian Albarello" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: "https://walbarellos.is-a.dev/og.jpg" },
      { property: "og:image:secure_url", content: "https://walbarellos.is-a.dev/og.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Willian Albarello — Portfólio & Currículo Interativo" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://walbarellos.is-a.dev/og.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://walbarellos.is-a.dev/" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@500;600&family=JetBrains+Mono:wght@400;600&family=Heebo:wght@400;700;800&family=Frank+Ruhl+Libre:wght@500;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(STRUCTURED_DATA),
      },
    ],
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
