/**
 * i18n do portfólio: Português (base) · English · עברית (RTL).
 *
 * - `ui`        → textos de interface
 * - `localize`  → conteúdo (projetos, histórico, stack, certificados, bio) no idioma escolhido
 * O conteúdo base continua em data/portfolio.ts (português). Aqui ficam só as traduções.
 */
import {
  bioInfo,
  categories,
  certificates,
  projects,
  stackGroups,
  timeline,
} from "@/data/portfolio";
import type { ProjectCategory } from "@/data/portfolio";

export type Lang = "pt" | "en" | "he";

export const LANGS: {
  id: Lang;
  /** Nome do idioma escrito no próprio idioma (é o que a pessoa lê e clica). */
  native: string;
  html: string;
  dir: "ltr" | "rtl";
  speech: string;
}[] = [
  { id: "pt", native: "Português", html: "pt-BR", dir: "ltr", speech: "pt-BR" },
  { id: "en", native: "English", html: "en", dir: "ltr", speech: "en-US" },
  { id: "he", native: "עברית", html: "he", dir: "rtl", speech: "he-IL" },
];

export function parseLang(v: string | null | undefined): Lang | null {
  const c = (v || "").toLowerCase();
  if (c.startsWith("pt")) return "pt";
  if (c.startsWith("he") || c.startsWith("iw")) return "he";
  if (c.startsWith("en")) return "en";
  return null;
}

/** Idioma preferido do navegador (primeiro que bater com os 3 suportados). */
export function detectLang(): Lang | null {
  if (typeof navigator === "undefined") return null;
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  // Se o visitante entende português, não sugere trocar: a página já abre em português
  if (list.some((raw) => (raw || "").toLowerCase().startsWith("pt"))) return null;

  for (const raw of list) {
    const l = parseLang(raw);
    if (l) return l;
  }
  return null;
}

/** Convite exibido NO idioma sugerido (quem lê entende de primeira). */
export const SUGGEST: Record<"en" | "he", { text: string; action: string; dismiss: string }> = {
  en: { text: "This page is also available in English.", action: "Read in English", dismiss: "Not now" },
  he: { text: "העמוד זמין גם בעברית.", action: "מעבר לעברית", dismiss: "לא עכשיו" },
};

/* ───────────────────────── Interface ───────────────────────── */

const pt = {
  langLabel: "Idioma",
  docTitle: "Willian Albarello — Engenheiro de Software & Sistemas",
  docDesc:
    "Portfólio de Willian Albarello. Tecnologia assistiva (Centelha/FINEP), engines de jogos com Fourier/Perlin em C++, engenharia reversa (Linux ELF), redes e arquiteturas em Rust e TypeScript. Rio Branco, Acre.",
  printDocTitle: "Willian Albarello — Currículo",

  skip: "Pular para o conteúdo principal",
  a11yBar: "Acessibilidade",
  a11yBarAria: "Barra de acessibilidade",
  readPage: "Ler página",
  readPageTitle: "Ler página com sintetizador de voz",
  pause: "Pausar",
  pauseTitle: "Pausar leitura",
  resume: "Continuar",
  resumeTitle: "Continuar leitura",
  stop: "Parar",
  stopTitle: "Parar leitura",
  textUp: "Aumentar texto",
  textDown: "Diminuir texto",
  textResetTitle: "Redefinir tamanho",
  contrast: "Contraste",
  themeDark: "Tema escuro",
  themeLight: "Tema claro",
  reading: "Lendo",
  paused: "Pausado",
  playing: "Reproduzindo",
  speechUnsupported: "A síntese de voz não é suportada neste navegador.",
  noVoice: "Seu navegador não tem uma voz instalada para este idioma.",

  print: "Modo impressão",
  printTitle: "Versão limpa do currículo, pronta para imprimir em A4",
  printNow: "Imprimir / Salvar PDF",
  printExit: "Sair do modo impressão",
  printBadge: "Modo impressão",
  printHint:
    "Versão limpa, em preto e branco, em A4 e sem animações. No diálogo de impressão, desative “Cabeçalhos e rodapés”.",

  heroWords: ["acessibilidade", "transparência pública", "Android", "Linux"],
  systemsFor: "Sistemas para",
  viewSystems: "Ver sistemas",
  talk: "Vamos conversar",
  resumePdf: "Currículo PDF",
  photoAlt: (name: string) => `Foto de ${name}`,
  lattes: "ID Lattes",

  navAria: "Seções",
  nav: { projetos: "Sistemas", stack: "Stack", certificados: "Certificados", historia: "Histórico", contato: "Contato" },

  sysSub: "Kotlin, Python, C++, TypeScript e Rust. Clique numa tecnologia para filtrar.",
  stackTitle: "Tech & Stack",
  stackSub: "O que eu uso no dia a dia.",
  certTitle: "Certificações",
  certSub: (n: number, h: number) => `Cursos e certificados. Inclui ${n} cursos do Bootcamp Bradesco (DIO), ${h}h no total.`,
  histTitle: "Histórico",
  histSub: "Estudo, trabalho e o que saiu do papel.",
  contactTitle: "Vamos conversar",

  filterAria: "Filtrar por categoria",
  showing: (n: number, total: number) => `Exibindo ${n} de ${total}`,
  techLabel: "Tecnologia:",
  clearFilter: "Limpar filtro ✕",
  noMatch: "Nada com esse filtro.",
  others: "Outros",
  private: "Privado",
  showLess: "Mostrar menos",
  showAllProjects: (n: number) => `Ver todos (+${n})`,
  showAllCerts: (n: number) => `Ver todas (${n})`,
  filterBy: (tech: string) => `Filtrar por ${tech}`,

  openPdf: "Abrir PDF ↗",
  enlarge: "Ampliar",
  openPdfAria: (title: string) => `Abrir certificado em PDF: ${title}`,
  enlargeAria: (title: string) => `Ampliar certificado: ${title}`,
  ongoing: "em andamento",

  contactIntro:
    "Acessibilidade, transparência pública, educação, cultura indígena. Se o sistema tem impacto real, me escreva.",
  copyEmail: "Copiar e-mail",
  copied: "Copiado ✓",
  copiedSr: "E-mail copiado para a área de transferência",
  quick: "Mensagem rápida",
  fName: "Nome",
  fSubject: "Assunto",
  subjects: ["Acessibilidade", "Sistema / freela", "Consultoria", "Parceria", "Outro"],
  fMessage: "Mensagem",
  send: "Enviar por e-mail",
  sending: "Abrindo seu e-mail…",
  sendHint: "Abre o seu app de e-mail com a mensagem pronta.",
  mailPrefix: "[Portfólio]",
  noName: "(sem nome)",

  qrDescResume: "Currículo online e interativo.",
  qrDescGithub: "Perfil no GitHub com os repositórios públicos.",
  qrAltResume: "QR Code que abre a versão publicada do currículo online",
  qrAltGithub: "QR Code que abre os repositórios no GitHub de Willian Albarello",
  qrSwitchGithub: "Ver QR do GitHub",
  qrSwitchResume: "Ver QR do currículo",

  quote: "Serenidade para aceitar o que não controlo, coragem para mudar o que posso e sabedoria para distinguir ambos.",
  rights: "© 2026 Willian Albarello · Rio Branco, Acre, Brasil",
  updated: "Atualizado em 10/2026",
  top: "Voltar ao topo ↑",

  lbAria: (title: string) => `Visualização do certificado: ${title}`,
  close: "Fechar (Esc)",
  prevCert: "Certificado anterior",
  nextCert: "Próximo certificado",
  openOriginal: "Abrir documento em PDF original ↗",

  readSystems: "Seção de Sistemas.",
  readSystem: (name: string, cat: string, summary: string, stack: string) =>
    `Sistema ${name}. Categoria: ${cat}. ${summary} Tecnologias: ${stack}.`,
  readStack: (s: string) => `Seção Stack tecnológica: ${s}`,
  readCerts:
    "Seção de Certificações. Cursos de cibersegurança, dados, sensoriamento inteligente e inglês TOEFL ITP.",
  readHistory: "Seção de Histórico. Das capacitações e certificações à graduação no IFAC.",
  readContact: (email: string) => `Seção de Contato. Email: ${email}. GitHub: github.com/walbarellos.`,

  pSummary: "Resumo",
  pSystems: "Sistemas selecionados",
  pHistory: "Formação e experiência",
  pStack: "Competências técnicas",
  pCerts: "Certificações",
  pOnline: "Versão online",
};

export type UI = typeof pt;

const en: UI = {
  langLabel: "Language",
  docTitle: "Willian Albarello — Software & Systems Engineer",
  docDesc:
    "Willian Albarello's portfolio. Assistive technology (Centelha/FINEP), game engines with Fourier/Perlin in C++, reverse engineering (Linux ELF), networking, and architectures in Rust and TypeScript. Rio Branco, Acre, Brazil.",
  printDocTitle: "Willian Albarello — Résumé",

  skip: "Skip to main content",
  a11yBar: "Accessibility",
  a11yBarAria: "Accessibility bar",
  readPage: "Read page",
  readPageTitle: "Read the page aloud with speech synthesis",
  pause: "Pause",
  pauseTitle: "Pause reading",
  resume: "Resume",
  resumeTitle: "Resume reading",
  stop: "Stop",
  stopTitle: "Stop reading",
  textUp: "Increase text size",
  textDown: "Decrease text size",
  textResetTitle: "Reset text size",
  contrast: "Contrast",
  themeDark: "Dark theme",
  themeLight: "Light theme",
  reading: "Reading",
  paused: "Paused",
  playing: "Playing",
  speechUnsupported: "Speech synthesis is not supported in this browser.",
  noVoice: "Your browser has no installed voice for this language.",

  print: "Print mode",
  printTitle: "Clean résumé version, ready to print on A4",
  printNow: "Print / Save as PDF",
  printExit: "Exit print mode",
  printBadge: "Print mode",
  printHint:
    "Clean, black-and-white, A4, no animations. In the print dialog, turn off “Headers and footers”.",

  heroWords: ["accessibility", "public transparency", "Android", "Linux"],
  systemsFor: "Systems for",
  viewSystems: "View systems",
  talk: "Let's talk",
  resumePdf: "Résumé PDF",
  photoAlt: (name: string) => `Photo of ${name}`,
  lattes: "Lattes ID",

  navAria: "Sections",
  nav: { projetos: "Systems", stack: "Stack", certificados: "Certificates", historia: "Background", contato: "Contact" },

  sysSub: "Kotlin, Python, C++, TypeScript and Rust. Click a technology to filter.",
  stackTitle: "Tech & Stack",
  stackSub: "What I use day to day.",
  certTitle: "Certifications",
  certSub: (n: number, h: number) => `Courses and certificates. Includes ${n} Bradesco Bootcamp (DIO) courses, ${h}h in total.`,
  histTitle: "Background",
  histSub: "Study, work, and what made it off the paper.",
  contactTitle: "Let's talk",

  filterAria: "Filter by category",
  showing: (n: number, total: number) => `Showing ${n} of ${total}`,
  techLabel: "Technology:",
  clearFilter: "Clear filter ✕",
  noMatch: "Nothing matches this filter.",
  others: "More",
  private: "Private",
  showLess: "Show less",
  showAllProjects: (n: number) => `Show all (+${n})`,
  showAllCerts: (n: number) => `Show all (${n})`,
  filterBy: (tech: string) => `Filter by ${tech}`,

  openPdf: "Open PDF ↗",
  enlarge: "Enlarge",
  openPdfAria: (title: string) => `Open certificate as PDF: ${title}`,
  enlargeAria: (title: string) => `Enlarge certificate: ${title}`,
  ongoing: "in progress",

  contactIntro:
    "Accessibility, public transparency, education, indigenous culture. If the system has real impact, write to me.",
  copyEmail: "Copy e-mail",
  copied: "Copied ✓",
  copiedSr: "E-mail copied to the clipboard",
  quick: "Quick message",
  fName: "Name",
  fSubject: "Subject",
  subjects: ["Accessibility", "System / freelance", "Consulting", "Partnership", "Other"],
  fMessage: "Message",
  send: "Send by e-mail",
  sending: "Opening your e-mail…",
  sendHint: "Opens your e-mail app with the message ready.",
  mailPrefix: "[Portfolio]",
  noName: "(no name)",

  qrDescResume: "Online, interactive résumé.",
  qrDescGithub: "GitHub profile with the public repositories.",
  qrAltResume: "QR code that opens the published online résumé",
  qrAltGithub: "QR code that opens Willian Albarello's repositories on GitHub",
  qrSwitchGithub: "Show GitHub QR",
  qrSwitchResume: "Show résumé QR",

  quote: "Serenity to accept what I cannot control, courage to change what I can, and wisdom to tell the two apart.",
  rights: "© 2026 Willian Albarello · Rio Branco, Acre, Brazil",
  updated: "Updated 10/2026",
  top: "Back to top ↑",

  lbAria: (title: string) => `Certificate viewer: ${title}`,
  close: "Close (Esc)",
  prevCert: "Previous certificate",
  nextCert: "Next certificate",
  openOriginal: "Open original PDF document ↗",

  readSystems: "Systems section.",
  readSystem: (name: string, cat: string, summary: string, stack: string) =>
    `System ${name}. Category: ${cat}. ${summary} Technologies: ${stack}.`,
  readStack: (s: string) => `Tech stack section: ${s}`,
  readCerts:
    "Certifications section. Courses in cybersecurity, data, smart sensing, and the TOEFL ITP English certificate.",
  readHistory: "Background section. From training and certifications to the degree at IFAC.",
  readContact: (email: string) => `Contact section. Email: ${email}. GitHub: github.com/walbarellos.`,

  pSummary: "Summary",
  pSystems: "Selected systems",
  pHistory: "Education & experience",
  pStack: "Technical skills",
  pCerts: "Certifications",
  pOnline: "Online version",
};

const he: UI = {
  langLabel: "שפה",
  docTitle: "Willian Albarello — מהנדס תוכנה ומערכות",
  docDesc:
    "תיק העבודות של Willian Albarello. טכנולוגיה מסייעת (Centelha/FINEP), מנועי משחקים ב-C++, הנדסה הפוכה וארכיטקטורות ב-Rust ו-TypeScript. ריו ברנקו, אקרי, ברזיל.",
  printDocTitle: "Willian Albarello — קורות חיים",

  skip: "דילוג לתוכן הראשי",
  a11yBar: "נגישות",
  a11yBarAria: "סרגל נגישות",
  readPage: "הקראת העמוד",
  readPageTitle: "הקראת העמוד באמצעות סינתזת דיבור",
  pause: "השהיה",
  pauseTitle: "השהיית ההקראה",
  resume: "המשך",
  resumeTitle: "המשך הקראה",
  stop: "עצירה",
  stopTitle: "עצירת ההקראה",
  textUp: "הגדלת טקסט",
  textDown: "הקטנת טקסט",
  textResetTitle: "איפוס גודל הטקסט",
  contrast: "ניגודיות",
  themeDark: "מצב כהה",
  themeLight: "מצב בהיר",
  reading: "מקריא",
  paused: "מושהה",
  playing: "מושמע",
  speechUnsupported: "סינתזת דיבור אינה נתמכת בדפדפן הזה.",
  noVoice: "בדפדפן שלך אין קול מותקן לשפה הזו.",

  print: "מצב הדפסה",
  printTitle: "גרסה נקייה של קורות החיים, מוכנה להדפסה ב-A4",
  printNow: "הדפסה / שמירה כ-PDF",
  printExit: "יציאה ממצב הדפסה",
  printBadge: "מצב הדפסה",
  printHint: "גרסה נקייה, בשחור-לבן, בגודל A4 וללא אנימציות. בחלון ההדפסה כדאי לכבות את “כותרות עליונות ותחתונות”.",

  heroWords: ["נגישות", "שקיפות ציבורית", "אנדרואיד", "לינוקס"],
  systemsFor: "מערכות עבור",
  viewSystems: "צפייה במערכות",
  talk: "בואו נדבר",
  resumePdf: "קורות חיים PDF",
  photoAlt: (name: string) => `תמונה של ${name}`,
  lattes: "מזהה Lattes",

  navAria: "מקטעים",
  nav: { projetos: "מערכות", stack: "טכנולוגיות", certificados: "תעודות", historia: "רקע", contato: "יצירת קשר" },

  sysSub: "Kotlin, Python, C++, TypeScript ו-Rust. לחצו על טכנולוגיה כדי לסנן.",
  stackTitle: "טכנולוגיות",
  stackSub: "מה אני משתמש בו מדי יום.",
  certTitle: "הסמכות",
  certSub: (n: number, h: number) => `קורסים ותעודות. כולל ${n} קורסים מהבוטקמפ של Bradesco‏ (DIO), ${h} שעות בסך הכול.`,
  histTitle: "רקע",
  histSub: "לימודים, עבודה ומה שיצא מהנייר.",
  contactTitle: "בואו נדבר",

  filterAria: "סינון לפי קטגוריה",
  showing: (n: number, total: number) => `מוצגים ${n} מתוך ${total}`,
  techLabel: "טכנולוגיה:",
  clearFilter: "ניקוי הסינון ✕",
  noMatch: "אין תוצאות לסינון הזה.",
  others: "נוספים",
  private: "פרטי",
  showLess: "הצג פחות",
  showAllProjects: (n: number) => `הצג הכול (+${n})`,
  showAllCerts: (n: number) => `הצג הכול (${n})`,
  filterBy: (tech: string) => `סינון לפי ${tech}`,

  openPdf: "פתיחת PDF ↗",
  enlarge: "הגדלה",
  openPdfAria: (title: string) => `פתיחת התעודה כ-PDF: ${title}`,
  enlargeAria: (title: string) => `הגדלת התעודה: ${title}`,
  ongoing: "בתהליך",

  contactIntro: "נגישות, שקיפות ציבורית, חינוך, תרבות ילידית. אם למערכת יש השפעה אמיתית — כתבו לי.",
  copyEmail: "העתקת האימייל",
  copied: "הועתק ✓",
  copiedSr: "האימייל הועתק ללוח",
  quick: "הודעה מהירה",
  fName: "שם",
  fSubject: "נושא",
  subjects: ["נגישות", "מערכת / פרילנס", "ייעוץ", "שיתוף פעולה", "אחר"],
  fMessage: "הודעה",
  send: "שליחה באימייל",
  sending: "פותח את האימייל…",
  sendHint: "פותח את אפליקציית האימייל שלכם עם ההודעה מוכנה.",
  mailPrefix: "[תיק עבודות]",
  noName: "(ללא שם)",

  qrDescResume: "קורות חיים מקוונים ואינטראקטיביים.",
  qrDescGithub: "פרופיל GitHub עם המאגרים הציבוריים.",
  qrAltResume: "קוד QR שפותח את גרסת קורות החיים המקוונת",
  qrAltGithub: "קוד QR שפותח את המאגרים של Willian Albarello ב-GitHub",
  qrSwitchGithub: "הצגת QR של GitHub",
  qrSwitchResume: "הצגת QR של קורות החיים",

  quote: "שלווה לקבל את מה שאינני יכול לשנות, אומץ לשנות את מה שאני יכול, וחוכמה להבחין בין השניים.",
  rights: "© 2026 Willian Albarello · ריו ברנקו, אקרי, ברזיל",
  updated: "עודכן ב-10/2026",
  top: "חזרה למעלה ↑",

  lbAria: (title: string) => `תצוגת התעודה: ${title}`,
  close: "סגירה (Esc)",
  prevCert: "התעודה הקודמת",
  nextCert: "התעודה הבאה",
  openOriginal: "פתיחת המסמך המקורי ב-PDF ↗",

  readSystems: "מקטע מערכות.",
  readSystem: (name: string, cat: string, summary: string, stack: string) =>
    `מערכת ${name}. קטגוריה: ${cat}. ${summary} טכנולוגיות: ${stack}.`,
  readStack: (s: string) => `מקטע טכנולוגיות: ${s}`,
  readCerts: "מקטע הסמכות. קורסים באבטחת סייבר, בנתונים ובחישה חכמה, ותעודת האנגלית TOEFL ITP.",
  readHistory: "מקטע רקע. מהכשרות ותעודות ועד הלימודים ב-IFAC.",
  readContact: (email: string) => `מקטע יצירת קשר. אימייל: ${email}. GitHub: github.com/walbarellos.`,

  pSummary: "תקציר",
  pSystems: "מערכות נבחרות",
  pHistory: "השכלה וניסיון",
  pStack: "כישורים טכניים",
  pCerts: "הסמכות",
  pOnline: "גרסה מקוונת",
};

export const ui: Record<Lang, UI> = { pt, en, he };

/* ───────────────────────── Conteúdo traduzido ───────────────────────── */

type Overlay = {
  categories: Record<ProjectCategory, string>;
  projects: Record<string, { name?: string; kind: string; summary: string; highlight?: string }>;
  timeline: { date: string; title: string; sub: string; desc: string }[];
  certs: Record<string, { title: string; meta: string; institution?: string }>;
  stack: { title: string; badge: string; items: string[] }[];
  bio: { role: string; summary: string; badges: string[]; availability: string; responseTime: string };
};

const content: Record<"en" | "he", Overlay> = {
  en: {
    categories: {
      all: "All",
      acessibilidade: "Accessibility & AAC",
      "cultura-educacao": "Culture & Education",
      "dados-osint": "Public Data",
      "sistemas-reversa": "Systems & Reversing",
      gamedev: "Gamedev & Graphics",
    },
    projects: {
      "fala-comigo": {
        kind: "Android · AAC · GPL-3.0",
        summary:
          "Communication app for non-verbal people, autistic people and educators. Works 100% offline, free and open source. A partner in Rio de Janeiro forked it for educational use, and the proposal was selected in Phase 1 of the Centelha Program (FAPEAC/FINEP).",
        highlight: "v0.3.0 · Centelha Phase 1",
      },
      sentinela: {
        kind: "Public Transparency",
        summary:
          "Monitor for Rio Branco's public contracts and tenders that flags out-of-pattern values and sends automatic alerts.",
        highlight: "Automatic alerts",
      },
      lexnode: {
        kind: "Public Data · Web",
        summary: "Search across the public data of the Acre Court of Justice (TJAC), with its own web interface.",
        highlight: "TJAC",
      },
      "acre-acessibilidade": {
        kind: "Accessibility · Open Data",
        summary:
          "Maps and promotes digital and physical accessibility in Acre: open inclusion data, audits of public portals (LBI/WCAG) and a widget featuring Capi, the capybara mascot.",
        highlight: "Capi mascot · LBI & WCAG",
      },
      "audio-editais": {
        kind: "Accessibility · Python",
        summary:
          "Turns public notices and documents into accessible MP3 audio, with automatic verification of what was spoken.",
        highlight: "Notice as audio",
      },
      "acre-licitacoes": {
        kind: "Civic ETL · Open Data",
        summary: "Merges Acre's Procurement Portal and PNCP into a single database for analyzing public tenders.",
        highlight: "Acre + PNCP",
      },
      werpy: {
        kind: "Management · ERP",
        summary:
          "ERP for sales, inventory and finance with separate access profiles for company and platform, and auditable workflows.",
        highlight: "Rust backend",
      },
      "kdeconnect-omarchy": {
        kind: "Systems · C++ · Linux",
        summary: "Native module that integrates KDE Connect into the Linux desktop under Wayland.",
        highlight: "C++20 & Wayland",
      },
      glyphwave: {
        kind: "Graphics · Engine",
        summary: "Procedural visual asset engine for Canvas 2D, written in plain JavaScript.",
        highlight: "Procedural art",
      },
      viva: {
        name: "VIVA — Living Indigenous Voices of Acre",
        kind: "Cultural Preservation",
        summary: "Public archive of endangered indigenous languages of Acre.",
      },
      cracklab: {
        kind: "Education · Reverse Engineering",
        summary: "Reverse engineering challenges on 64-bit Linux, with write-ups.",
      },
      "kite-game": {
        kind: "Game · PC and Android",
        summary: "Multiplayer kite-fighting game. In development.",
      },
      "briga-de-tank": {
        kind: "Android · Arcade",
        summary: "Tank combat with local multiplayer for up to 8 players.",
      },
      viradez: {
        kind: "Android · Study",
        summary: "Calculator that shows the solution step by step.",
      },
      "rtsp-scanner": {
        kind: "Network Security · Study",
        summary: "Study of security auditing on networks with IP cameras.",
      },
      "youtube-transcript": {
        kind: "Automation · CLI",
        summary: "Downloads YouTube video transcripts from the terminal.",
      },
    },
    timeline: [
      {
        date: "2026 — Present",
        title: "Systems for Internet — IFAC",
        sub: "Federal Institute of Acre · Rio Branco Campus · 2nd term",
        desc: "Enrolled in 2026. Studying networks, development and matrix algebra, while building real systems alongside the course.",
      },
      {
        date: "2026",
        title: "Acre Acessibilidade — Concept",
        sub: "Open Data · LBI · WCAG",
        desc: "System to audit and map digital and physical accessibility in public agencies and spaces in Acre, under the LBI (Brazilian Inclusion Law) and with open data.",
      },
      {
        date: "2026",
        title: "Fala Comigo v0.3.0 — Production",
        sub: "Android AAC app · GPL-3.0 · VirusTotal 0/72",
        desc: "Communication app for non-verbal people. Educational fork by a partner in Rio de Janeiro. Proposal selected in Phase 1 of the Centelha Program (FAPEAC/FINEP).",
      },
      {
        date: "2026",
        title: "CrackLab — Reversing Platform",
        sub: "crack-lab.vercel.app · 10 challenges · C + Python",
        desc: "Reverse engineering learning platform with binaries written from scratch and detailed write-ups.",
      },
      {
        date: "2024",
        title: "English Certification — TOEFL ITP",
        sub: "Level B2 (Upper Intermediate)",
        desc: "Proof of proficiency in listening comprehension, structure, written expression and reading.",
      },
      {
        date: "2023",
        title: "Training: “Good Practices in Public Service”",
        sub: "Organization Directorate for Service Centers — OCA",
        desc: "Plain Language, Quality Management, posture and conduct in dialogue with citizens, and Information Management.",
      },
    ],
    certs: {
      "cert-toefl": {
        title: "English Certification — TOEFL ITP (Level B2)",
        institution: "Languages without Borders (Idiomas sem Fronteiras)",
        meta: "Level B2",
      },
      "cert-sensoriamento": {
        title: "Fundamentals of Smart Sensing Platforms for Industry",
        meta: "30 hours",
      },
      "cert-oca": {
        title: "Good Practices in Public Service",
        institution: "OCA — Government of Acre",
        meta: "Training",
      },
      "cert-cyber-essencial": {
        title: "Essential Cybersecurity: Foundations for Your Data and AI Projects",
        meta: "8 hours",
      },
      "cert-sieli": {
        title: "IV International Seminar on Linguistic Studies and Internationalization",
        meta: "10 hours",
      },
      "cert-ia-moderna": {
        title: "Modern AI Fundamentals: Machine Learning, LLMs, Generative AI and Agents",
        meta: "2 hours",
      },
      "cert-llms": { title: "Fundamentals of Large Language Models (LLMs)", meta: "1 hour" },
      "cert-principios-cyber": { title: "Principles of Cybersecurity", meta: "2 hours" },
      "cert-dados-cyber": {
        title: "Introduction to Data Collection and Analysis in Cybersecurity",
        meta: "2 hours",
      },
      "cert-eng-social": { title: "Topics in Social Engineering", meta: "1 hour" },
      "cert-devsecops": { title: "Introduction to DevSecOps", meta: "1 hour" },
      "cert-so-vms": {
        title: "Operating Systems and Virtual Machines: Concepts and Practice",
        meta: "2 hours",
      },
      "cert-bootcamp-bradesco": {
        title: "Welcome to the Bradesco Bootcamp — GenAI, Data & Cyber",
        meta: "1 hour",
      },
      "cert-catedra": {
        title: "Open Chair: Studies on Parasitic Metazoans in Acre",
        meta: "2 hours",
      },
      "cert-nasa": {
        title: "Nancy Grace Roman Space Telescope — Adopt a Pixel",
        meta: "Pixel ID: 00634488",
      },
    },
    stack: [
      {
        title: "Languages",
        badge: "Real-world Mastery",
        items: [
          "Python (automation, ETL, public data)",
          "Kotlin (native Android: Jetpack Compose, Room, StateFlow)",
          "C & C++ (Linux, raylib, Wayland)",
          "TypeScript & JavaScript (Next.js, Web Components, Canvas 2D)",
          "Rust (wErpy)",
          "Shell / Bash & Makefile",
        ],
      },
      {
        title: "Mobile & Accessibility",
        badge: "Offline-first & LBI/WCAG",
        items: [
          "Android SDK & Jetpack Compose",
          "Offline-first architecture & Room",
          "Augmentative and Alternative Communication (AAC)",
          "Web Components (Capi mascot)",
          "Digital accessibility (LBI, WCAG 2.1 AA, screen readers)",
          "Speech synthesis and recognition (TTS, Web Speech API)",
        ],
      },
      {
        title: "Reverse Engineering & Security",
        badge: "Down to the Metal",
        items: [
          "Linux 64-bit ELF binary analysis",
          "GDB, radare2 and Ghidra",
          "x86 / x86-64 Assembly",
          "Building educational reversing challenges",
        ],
      },
      {
        title: "Public Data & Automation",
        badge: "ETL & Transparency",
        items: [
          "Web scraping and automation (Selenium, BeautifulSoup)",
          "FastAPI, PostgreSQL & DuckDB",
          "Government integrations (PNCP, state and municipal portals)",
          "n8n and automatic alerts",
        ],
      },
      {
        title: "Graphics & Gamedev",
        badge: "Physics & Procedural",
        items: [
          "HTML5 Canvas 2D and procedural generation",
          "C++ & raylib",
          "Godot Engine & GDScript",
          "Game loops in Kotlin (Android)",
        ],
      },
    ],
    bio: {
      role: "Systems Developer",
      summary:
        "I build systems with purpose — from accessibility Android apps to public transparency tools and educational platforms. Independent, product-oriented, focused on real impact.",
      badges: ["Rio Branco, Acre", "IFAC · 2nd term"],
      availability: "Open to freelance work and collaborations",
      responseTime: "Reply within 24h · UTC−5",
    },
  },

  he: {
    categories: {
      all: "הכול",
      acessibilidade: "נגישות ותקשורת תומכת וחליפית (AAC)",
      "cultura-educacao": "תרבות וחינוך",
      "dados-osint": "נתונים ציבוריים",
      "sistemas-reversa": "מערכות והנדסה לאחור",
      gamedev: "פיתוח משחקים וגרפיקה",
    },
    projects: {
      "fala-comigo": {
        kind: "אנדרואיד · AAC · GPL-3.0",
        summary:
          "אפליקציית תקשורת לאנשים שאינם דוברים, לאנשים על הספקטרום האוטיסטי ולאנשי חינוך. פועלת במלואה ללא חיבור לאינטרנט, חינמית ובקוד פתוח. שותף בריו דה ז'ניירו יצר ממנה פורק (fork) לשימוש חינוכי, והמערכת אושרה בתוכנית Centelha‏ (FAPEAC/FINEP).",
        highlight: "v0.3.0 · Centelha שלב 2",
      },
      sentinela: {
        kind: "שקיפות ציבורית",
        summary: "מוניטור לחוזים ולמכרזים ציבוריים של ריו ברנקו, שמסמן ערכים חריגים ושולח התראה אוטומטית.",
        highlight: "התראות אוטומטיות",
      },
      lexnode: {
        kind: "נתונים ציבוריים · ווב",
        summary: "חיפוש בנתונים הציבוריים של בית המשפט של מדינת אקרי (TJAC), עם ממשק ווב משלו.",
        highlight: "TJAC",
      },
      "acre-acessibilidade": {
        kind: "נגישות · נתונים פתוחים",
        summary:
          "ממפה ומקדם נגישות דיגיטלית ופיזית באקרי: נתונים פתוחים על הכלה, ביקורת של אתרים ציבוריים (LBI/WCAG) וווידג'ט עם הקמע קפי, הקפיברה.",
        highlight: "הקמע קפי · LBI ו-WCAG",
      },
      "audio-editais": {
        kind: "נגישות · Python",
        summary: "הופך מכרזים ומסמכים ציבוריים לשמע MP3 נגיש, עם בדיקה אוטומטית של מה שהוקרא.",
        highlight: "מכרז בשמע",
      },
      "acre-licitacoes": {
        kind: "ETL אזרחי · נתונים פתוחים",
        summary: "מאחד את פורטל המכרזים של אקרי ואת PNCP לבסיס נתונים אחד לניתוח מכרזים ציבוריים.",
        highlight: "אקרי + PNCP",
      },
      werpy: {
        kind: "ניהול · ERP",
        summary:
          "מערכת ERP למכירות, מלאי וכספים, עם פרופילי גישה נפרדים לחברה ולפלטפורמה ותהליכים הניתנים לביקורת.",
        highlight: "Backend ב-Rust",
      },
      "kdeconnect-omarchy": {
        kind: "מערכות · C++ · לינוקס",
        summary: "מודול נייטיב שמשלב את KDE Connect בשולחן העבודה של לינוקס תחת Wayland.",
        highlight: "C++20 ו-Wayland",
      },
      glyphwave: {
        kind: "גרפיקה · מנוע",
        summary: "מנוע לנכסים חזותיים פרוצדורליים עבור Canvas 2D, כתוב ב-JavaScript נקי.",
        highlight: "אמנות פרוצדורלית",
      },
      viva: {
        name: "VIVA — קולות ילידיים חיים של אקרי",
        kind: "שימור תרבותי",
        summary: "ארכיון ציבורי של שפות ילידיות באקרי הנמצאות בסכנת הכחדה.",
      },
      cracklab: {
        kind: "חינוך · הנדסה לאחור",
        summary: "אתגרי הנדסה לאחור על לינוקס 64-ביט, עם כתבי פתרון.",
      },
      "kite-game": {
        kind: "משחק · מחשב ואנדרואיד",
        summary: "משחק רב-משתתפים של קרבות עפיפונים. בפיתוח.",
      },
      "briga-de-tank": {
        kind: "אנדרואיד · ארקייד",
        summary: "קרב טנקים עם מולטיפלייר מקומי של עד 8 שחקנים.",
      },
      viradez: {
        kind: "אנדרואיד · לימוד",
        summary: "מחשבון שמציג את הפתרון צעד אחר צעד.",
      },
      "rtsp-scanner": {
        kind: "אבטחת רשת · לימוד",
        summary: "מחקר של ביקורת אבטחה ברשתות עם מצלמות IP.",
      },
      "youtube-transcript": {
        kind: "אוטומציה · CLI",
        summary: "מוריד תמלילים של סרטוני יוטיוב מהטרמינל.",
      },
    },
    timeline: [
      {
        date: "2026 — הווה",
        title: "מערכות לאינטרנט — IFAC",
        sub: "המכון הפדרלי של אקרי · קמפוס ריו ברנקו · סמסטר 2",
        desc: "התחלתי ב-2026. לומד רשתות, פיתוח ואלגברה מטריציונית, ובמקביל בונה מערכות אמיתיות.",
      },
      {
        date: "2026",
        title: "Acre Acessibilidade — תכנון ראשוני",
        sub: "נתונים פתוחים · LBI · WCAG",
        desc: "מערכת לביקורת ולמיפוי של נגישות דיגיטלית ופיזית בגופים ובמרחבים ציבוריים באקרי, לפי חוק ההכללה הברזילאי (LBI) ובאמצעות נתונים פתוחים.",
      },
      {
        date: "2026",
        title: "Fala Comigo v0.3.0 — בייצור",
        sub: "אפליקציית AAC לאנדרואיד · GPL-3.0 · VirusTotal 0/72",
        desc: "אפליקציית תקשורת לאנשים שאינם דוברים. פורק חינוכי שיצר שותף בריו דה ז'ניירו. אושרה בתוכנית Centelha‏ (FAPEAC/FINEP).",
      },
      {
        date: "2026",
        title: "CrackLab — פלטפורמת הנדסה לאחור",
        sub: "crack-lab.vercel.app · 10 אתגרים · C + Python",
        desc: "פלטפורמת לימוד להנדסה לאחור, עם בינאריים שנכתבו מאפס וכתבי פתרון מפורטים.",
      },
      {
        date: "2024",
        title: "הסמכת אנגלית — TOEFL ITP",
        sub: "רמה B2 (בינוני-גבוה)",
        desc: "הוכחת שליטה בהבנת הנשמע, במבנה השפה, בביטוי בכתב ובהבנת הנקרא.",
      },
      {
        date: "2023",
        title: "הכשרה: “שיטות עבודה מומלצות במתן שירות לציבור”",
        sub: "מנהלת הארגון של מרכזי השירות — OCA",
        desc: "שפה פשוטה, ניהול איכות, יחס והתנהגות בשיח עם האזרח, וניהול מידע.",
      },
    ],
    certs: {
      "cert-toefl": {
        title: "הסמכת אנגלית — TOEFL ITP (רמה B2)",
        institution: "שפות ללא גבולות (Idiomas sem Fronteiras)",
        meta: "רמה B2",
      },
      "cert-sensoriamento": { title: "יסודות פלטפורמות חישה חכמה לתעשייה", meta: "30 שעות" },
      "cert-oca": {
        title: "שיטות עבודה מומלצות במתן שירות לציבור",
        institution: "OCA — ממשלת אקרי",
        meta: "הכשרה",
      },
      "cert-cyber-essencial": {
        title: "אבטחת סייבר בסיסית: יסודות לפרויקטים של נתונים ובינה מלאכותית",
        meta: "8 שעות",
      },
      "cert-sieli": {
        title: "הסמינר הבינלאומי הרביעי ללימודי בלשנות ובינאום",
        meta: "10 שעות",
      },
      "cert-ia-moderna": {
        title: "יסודות הבינה המלאכותית המודרנית: למידת מכונה, LLM, בינה גנרטיבית וסוכנים",
        meta: "שעתיים",
      },
      "cert-llms": { title: "יסודות מודלי שפה גדולים (LLM)", meta: "שעה" },
      "cert-principios-cyber": { title: "עקרונות אבטחת הסייבר", meta: "שעתיים" },
      "cert-dados-cyber": { title: "מבוא לאיסוף וניתוח נתונים באבטחת סייבר", meta: "שעתיים" },
      "cert-eng-social": { title: "נושאים בהנדסה חברתית", meta: "שעה" },
      "cert-devsecops": { title: "מבוא ל-DevSecOps", meta: "שעה" },
      "cert-so-vms": { title: "מערכות הפעלה ומכונות וירטואליות: מושגים ויישום", meta: "שעתיים" },
      "cert-bootcamp-bradesco": {
        title: "ברוכים הבאים לבוטקמפ של Bradesco — GenAI, נתונים וסייבר",
        meta: "שעה",
      },
      "cert-catedra": {
        title: "קתדרה פתוחה: מחקרים על טפילים מסוג מטזואה באקרי",
        meta: "שעתיים",
      },
      "cert-nasa": {
        title: "טלסקופ החלל Nancy Grace Roman — אמצו פיקסל",
        meta: "מזהה פיקסל: 00634488",
      },
    },
    stack: [
      {
        title: "שפות",
        badge: "שליטה ושימוש אמיתי",
        items: [
          "Python (אוטומציות, ETL, נתונים ציבוריים)",
          "Kotlin (אנדרואיד נייטיב: Jetpack Compose, Room, StateFlow)",
          "C ו-C++ (לינוקס, raylib, Wayland)",
          "TypeScript ו-JavaScript (Next.js, Web Components, Canvas 2D)",
          "Rust (wErpy)",
          "Shell / Bash ו-Makefile",
        ],
      },
      {
        title: "מובייל ונגישות",
        badge: "Offline-first ו-LBI/WCAG",
        items: [
          "Android SDK ו-Jetpack Compose",
          "ארכיטקטורת Offline-first ו-Room",
          "תקשורת תומכת וחליפית (AAC)",
          "Web Components (הקמע קפי)",
          "נגישות דיגיטלית (LBI, WCAG 2.1 AA, קוראי מסך)",
          "סינתזת דיבור וזיהוי דיבור (TTS, Web Speech API)",
        ],
      },
      {
        title: "הנדסה לאחור ואבטחה",
        badge: "עד רמת החומרה",
        items: [
          "ניתוח בינאריים מסוג ELF בלינוקס 64-ביט",
          "GDB, radare2 ו-Ghidra",
          "אסמבלי x86 / x86-64",
          "יצירת אתגרי הנדסה לאחור לימודיים",
        ],
      },
      {
        title: "נתונים ציבוריים ואוטומציה",
        badge: "ETL ושקיפות",
        items: [
          "איסוף נתונים ואוטומציה באינטרנט (Selenium, BeautifulSoup)",
          "FastAPI, PostgreSQL ו-DuckDB",
          "שילוב עם מערכות ממשלתיות (PNCP, פורטלים של מדינות ועיריות)",
          "n8n והתראות אוטומטיות",
        ],
      },
      {
        title: "גרפיקה ופיתוח משחקים",
        badge: "פיזיקה ויצירה פרוצדורלית",
        items: [
          "HTML5 Canvas 2D ויצירה פרוצדורלית",
          "C++ ו-raylib",
          "Godot Engine ו-GDScript",
          "לולאות משחק ב-Kotlin (אנדרואיד)",
        ],
      },
    ],
    bio: {
      role: "מפתח מערכות",
      summary:
        "אני בונה מערכות עם מטרה — מאפליקציות אנדרואיד לנגישות ועד כלי שקיפות ציבורית ופלטפורמות חינוכיות. עצמאי, ממוקד מוצר, עם דגש על השפעה אמיתית.",
      badges: ["ריו ברנקו, אקרי", "IFAC · סמסטר 2"],
      availability: "פתוח לעבודות פרילנס ולשיתופי פעולה",
      responseTime: "מענה תוך 24 שעות · UTC−5",
    },
  },
};

/* ───────────────────────── Aplicação do idioma ───────────────────────── */

const dioBase = certificates.filter((c) => c.institution.startsWith("DIO"));
const dio = {
  count: dioBase.length,
  hours: dioBase.reduce((sum, c) => sum + (parseInt(c.meta, 10) || 0), 0),
};

export function localize(lang: Lang) {
  if (lang === "pt") {
    return { bioInfo, categories, projects, timeline, certificates, stackGroups, dio };
  }
  const o = content[lang];
  return {
    bioInfo: { ...bioInfo, ...o.bio },
    categories: categories.map((c) => ({ ...c, label: o.categories[c.id] ?? c.label })),
    projects: projects.map((p) => {
      const t = o.projects[p.id];
      return t ? { ...p, ...t, categoryLabel: o.categories[p.category] ?? p.categoryLabel } : p;
    }),
    timeline: timeline.map((item, i) => ({ ...item, ...(o.timeline[i] ?? {}) })),
    certificates: certificates.map((c) => ({ ...c, ...(o.certs[c.id] ?? {}) })),
    stackGroups: stackGroups.map((g, i) => ({ ...g, ...(o.stack[i] ?? {}) })),
    dio,
  };
}

export type Localized = ReturnType<typeof localize>;
