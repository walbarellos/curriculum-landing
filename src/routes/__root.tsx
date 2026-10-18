import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const TITLE = "Willian Albarello — Engenheiro de Software & Sistemas";
const DESC =
  "Portfólio de Willian Albarello. Tecnologia assistiva (Centelha/FINEP), engines de jogos com Fourier/Perlin em C++, engenharia reversa (Linux ELF), redes e arquiteturas em Rust e TypeScript. Rio Branco, Acre.";

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
      jobTitle: "Engenheiro de Software & Sistemas",
      description:
        "Engenheiro de software e criador de sistemas. Desenvolve tecnologia assistiva e acessibilidade (proposta selecionada na 1ª fase do Programa Centelha/FINEP), engines de jogos com geração procedural (Fourier e Perlin em C++), ferramentas de engenharia reversa (Linux ELF) e arquiteturas completas em Rust, Kotlin e TypeScript.",
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
        "https://ataacre.netlify.app",
        "http://lattes.cnpq.br/1326474169012655",
        "https://mastodon.social/@walbarellos",
      ],
      creatorOf: [
        {
          "@type": "SoftwareApplication",
          name: "Fala Comigo",
          applicationCategory: "AccessibilityApplication",
          operatingSystem: "Android",
          url: "https://github.com/walbarellos/FalaComigo",
          description:
            "App de comunicação alternativa e aumentativa (CAA) para pessoas não verbais e autistas. 100% offline-first, open-source, selecionado na fase 1 do Programa Centelha (FAPEAC/FINEP).",
        },
        {
          "@type": "SoftwareApplication",
          name: "KDE Connect Omarchy",
          applicationCategory: "SystemApplication",
          operatingSystem: "Linux",
          url: "https://github.com/walbarellos/kdeconnect-omarchy",
          description:
            "Módulo de engenharia de sistemas em C++20 integrando o KDE Connect ao ecossistema desktop Linux sob Wayland.",
        },
        {
          "@type": "SoftwareApplication",
          name: "Sentinela",
          applicationCategory: "PublicTransparencyApplication",
          operatingSystem: "Linux",
          url: "https://github.com/walbarellos/Sentinela",
          description:
            "Monitor autônomo de contratos públicos e licitações municipais com análise de anomalias orçamentárias em DuckDB e alertas automatizados.",
        },
        {
          "@type": "SoftwareApplication",
          name: "LexNode",
          applicationCategory: "LegalTechApplication",
          operatingSystem: "Cross-platform",
          url: "https://github.com/walbarellos/LexNode",
          description:
            "Interface e motor de pesquisa estruturada para dados abertos do Tribunal de Justiça do Estado do Acre (TJAC).",
        },
        {
          "@type": "WebApplication",
          name: "ATA Acre",
          url: "https://ataacre.netlify.app",
          description:
            "Plataforma documental e independente de fiscalização orçamentária e transparência pública no Acre com leitor assistivo neural integrado.",
        },
        {
          "@type": "SoftwareApplication",
          name: "wErpy",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Cross-platform",
          url: "https://github.com/walbarellos/wErpy",
          description:
            "ERP modular de gestão de vendas, estoque e fluxo financeiro auditável com backend nativo em Rust e PostgreSQL.",
        },
        {
          "@type": "SoftwareApplication",
          name: "GlyphWave",
          applicationCategory: "GraphicsApplication",
          operatingSystem: "Web",
          url: "https://github.com/walbarellos/GlyphWave",
          description:
            "Engine procedural de renderização e geração de assets visuais para Canvas 2D em JavaScript puro.",
        },
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Software & Systems Engineer",
          description: "Arquiteturas completas em Rust, Kotlin, TypeScript, C++ e Linux.",
        },
        {
          "@type": "Occupation",
          name: "Assistive Technology Specialist",
          description: "Acessibilidade digital, CAA offline-first (Centelha/FINEP) e síntese de voz.",
        },
        {
          "@type": "Occupation",
          name: "Game Developer & Graphics Programmer",
          description: "Jogos em C++/raylib e geração procedural com transformadas de Fourier e ruído de Perlin.",
        },
        {
          "@type": "Occupation",
          name: "Security Researcher & Reverse Engineer",
          description: "Engenharia reversa em binários Linux ELF 64-bit, Assembly x86-64 e auditoria de redes.",
        },
      ],
      knowsAbout: [
        "Engenharia de Software (Software Engineering)",
        "Tecnologia Assistiva & Acessibilidade Digital (CAA, WCAG 2.1 AA, LBI)",
        "Desenvolvimento de Jogos & Gamedev (C++, raylib, Android)",
        "Computação Gráfica & Geração Procedural (Fourier, Perlin noise, Canvas 2D)",
        "Engenharia Reversa & Cibersegurança (Linux ELF 64-bit, Assembly x86-64)",
        "Redes & Protocolos (Servidores IRC, Sockets)",
        "Inteligência Cívica & OSINT (Dados Públicos, TJAC, PNCP)",
        "C & C++20 (CMake, Wayland, programação nativa de sistemas)",
        "Rust (ERP modular, backend de sistemas)",
        "Android nativo & Kotlin (Jetpack Compose, Room, Offline-first)",
        "Python & FastAPI",
        "TypeScript, React 19 & TanStack",
        "Linux & Arquitetura de Sistemas",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": "https://walbarellos.is-a.dev/#profilepage",
      url: "https://walbarellos.is-a.dev/",
      name: "Willian Albarello — Engenheiro de Software & Sistemas",
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
          "Willian Albarello, engenheiro de software, sistemas, tecnologia assistiva, acessibilidade digital, CAA, Fala Comigo, Centelha FINEP, gamedev, jogos C++, raylib, fourier, perlin noise, engenharia reversa, ciberseguranca, irc, rust, android, kotlin, linux, acre, portfolio",
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
      { property: "og:image:alt", content: "Willian Albarello — Engenheiro de Software & Sistemas" },
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
