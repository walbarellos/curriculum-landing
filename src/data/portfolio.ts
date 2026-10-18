export type ProjectCategory =
  | "all"
  | "acessibilidade"
  | "cultura-educacao"
  | "dados-osint"
  | "sistemas-reversa"
  | "gamedev";

export type Project = {
  id: string;
  name: string;
  /** Sem href = projeto privado (exibe selo "Privado" em vez de link). */
  href?: string;
  category: ProjectCategory;
  categoryLabel: string;
  kind: string;
  summary: string;
  stack: string[];
  /** true = grade principal (ordem do array). false/ausente = lista compacta em "Ver todos". */
  featured?: boolean;
  /** Sem link público de propósito: mostra selo "Privado". */
  private?: boolean;
  highlight?: string;
};

export const categories: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "acessibilidade", label: "Acessibilidade & CAA" },
  { id: "cultura-educacao", label: "Cultura & Educação" },
  { id: "dados-osint", label: "Dados Públicos" },
  { id: "sistemas-reversa", label: "Sistemas & Reversing" },
  { id: "gamedev", label: "Gamedev & Gráficos" },
];

export const projects: Project[] = [
  // ───────────── Principais (nesta ordem) ─────────────
  {
    id: "ata-acre",
    name: "ATA Acre",
    href: "https://ataacre.netlify.app/",
    category: "dados-osint",
    categoryLabel: "Dados Públicos",
    kind: "Plataforma Documental · Transparência",
    summary:
      "Plataforma documental sobre fiscalização orçamentária e dados abertos no Acre. Integra o leitor de tela neural Acre-Acessibilidade com o mascote Capi.",
    stack: ["TypeScript", "TanStack Start", "WCAG", "Dados Abertos"],
    featured: true,
    highlight: "Dados Públicos & Orçamento",
  },
  {
    id: "fala-comigo",
    name: "Fala Comigo",
    href: "https://github.com/walbarellos/FalaComigo",
    category: "acessibilidade",
    categoryLabel: "Acessibilidade & CAA",
    kind: "Android · CAA · GPL-3.0",
    summary:
      "App de comunicação para pessoas não verbais, autistas e educadores. Funciona 100% offline, é gratuito e open source. Um parceiro no RJ fez fork para uso educacional, e a proposta foi selecionada na 1ª fase do Programa Centelha (FAPEAC/FINEP).",
    stack: ["Kotlin", "Jetpack Compose", "Room", "Offline-first"],
    featured: true,
    highlight: "v0.3.0 · Centelha fase 1",
  },
  {
    id: "sentinela",
    name: "Sentinela",
    href: "https://github.com/walbarellos/Sentinela",
    category: "dados-osint",
    categoryLabel: "Dados Públicos",
    kind: "Transparência Pública",
    summary:
      "Monitor de contratos e licitações de Rio Branco que sinaliza valores fora do padrão e avisa por alerta automático.",
    stack: ["Python", "DuckDB", "n8n"],
    featured: true,
    highlight: "Alertas automáticos",
  },
  {
    id: "lexnode",
    name: "LexNode",
    href: "https://github.com/walbarellos/LexNode",
    category: "dados-osint",
    categoryLabel: "Dados Públicos",
    kind: "Dados Públicos · Web",
    summary:
      "Pesquisa nos dados públicos do Tribunal de Justiça do Acre (TJAC), com interface web própria.",
    stack: ["Python", "FastAPI", "Tailwind CSS"],
    featured: true,
    highlight: "TJAC",
  },
  {
    id: "acre-acessibilidade",
    name: "Acre Acessibilidade",
    href: "https://github.com/walbarellos/Acre-Acessibilidade",
    category: "acessibilidade",
    categoryLabel: "Acessibilidade & CAA",
    kind: "Acessibilidade · Dados Abertos",
    summary:
      "Mapeia e fomenta a acessibilidade digital e física no Acre: dados abertos de inclusão, auditoria de portais públicos (LBI/WCAG) e um widget com o mascote Capi, a capivara.",
    stack: ["TypeScript", "Web Components", "Python", "WCAG 2.1"],
    featured: true,
    highlight: "Mascote Capi · LBI & WCAG",
  },
  {
    id: "audio-editais",
    name: "Audio Editais",
    category: "acessibilidade",
    categoryLabel: "Acessibilidade & CAA",
    kind: "Acessibilidade · Python",
    summary:
      "Transforma editais e documentos públicos em áudio MP3 acessível, com conferência automática do que foi falado.",
    stack: ["Python", "TTS", "Whisper"],
    featured: true,
    highlight: "Edital em áudio",
  },
  {
    id: "acre-licitacoes",
    name: "Acre Licitações",
    href: "https://github.com/walbarellos/Acre-Processos-Licitatorios",
    category: "dados-osint",
    categoryLabel: "Dados Públicos",
    kind: "ETL Cívico · Dados Abertos",
    summary:
      "Junta o Portal de Licitações do Acre e o PNCP em uma base única para analisar editais públicos.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    featured: true,
    highlight: "Acre + PNCP",
  },
  {
    id: "werpy",
    name: "wErpy",
    href: "https://github.com/walbarellos/wErpy",
    category: "sistemas-reversa",
    categoryLabel: "Sistemas & Reversing",
    kind: "Gestão · ERP",
    summary:
      "ERP de vendas, estoque e financeiro com perfis de acesso separados para empresa e plataforma e fluxos auditáveis.",
    stack: ["Rust", "React", "PostgreSQL", "Docker"],
    featured: true,
    highlight: "Backend em Rust",
  },
  {
    id: "kdeconnect-omarchy",
    name: "KDE Connect Omarchy",
    href: "https://github.com/walbarellos/kdeconnect-omarchy",
    category: "sistemas-reversa",
    categoryLabel: "Sistemas & Reversing",
    kind: "Sistemas · C++ · Linux",
    summary:
      "Módulo nativo que integra o KDE Connect ao desktop Linux sob Wayland.",
    stack: ["C++20", "Wayland", "CMake"],
    featured: true,
    highlight: "C++20 & Wayland",
  },
  {
    id: "glyphwave",
    name: "GlyphWave",
    href: "https://github.com/walbarellos/GlyphWave",
    category: "gamedev",
    categoryLabel: "Gamedev & Gráficos",
    kind: "Gráficos · Engine",
    summary:
      "Engine de assets visuais procedurais para Canvas 2D, escrita em JavaScript puro.",
    stack: ["Vanilla JS", "Canvas 2D"],
    featured: true,
    highlight: "Arte procedural",
  },

  // ───────────── Em "Ver todos" ─────────────
  {
    id: "viva",
    name: "VIVA — Vozes Indígenas Vivas do Acre",
    href: "https://github.com/walbarellos/VIVA",
    category: "cultura-educacao",
    categoryLabel: "Cultura & Educação",
    kind: "Preservação Cultural",
    summary: "Acervo público de línguas indígenas acreanas em risco de extinção.",
    stack: ["Python", "Next.js", "PostgreSQL"],
  },
  {
    id: "kite-game",
    name: "Kite Game",
    category: "gamedev",
    categoryLabel: "Gamedev & Gráficos",
    kind: "Jogo · PC e Android",
    summary: "Jogo multiplayer de pipas. Em desenvolvimento.",
    stack: ["C++", "raylib", "Android"],
    private: true,
  },
  {
    id: "briga-de-tank",
    name: "Briga de Tank",
    href: "https://github.com/walbarellos/Briga-de-Tank",
    category: "gamedev",
    categoryLabel: "Gamedev & Gráficos",
    kind: "Android · Arcade",
    summary: "Combate de tanques com multiplayer local para até 8 jogadores.",
    stack: ["Kotlin", "Android SDK"],
  },
  {
    id: "viradez",
    name: "ViraDez",
    href: "https://github.com/walbarellos/ViraDez",
    category: "cultura-educacao",
    categoryLabel: "Cultura & Educação",
    kind: "Android · Estudo",
    summary: "Calculadora que mostra a resolução passo a passo.",
    stack: ["Kotlin", "Android SDK"],
  },
  {
    id: "rtsp-scanner",
    name: "RTSP Scanner Pro",
    href: "https://github.com/walbarellos/RTSP-Scanner-Pro",
    category: "sistemas-reversa",
    categoryLabel: "Sistemas & Reversing",
    kind: "Segurança de Rede · Estudo",
    summary: "Estudo de auditoria de segurança em redes com câmeras IP.",
    stack: ["Python", "Redes"],
  },
  {
    id: "youtube-transcript",
    name: "Youtube Transcript",
    href: "https://github.com/walbarellos/Youtube-Transcript",
    category: "dados-osint",
    categoryLabel: "Dados Públicos",
    kind: "Automação · CLI",
    summary: "Baixa transcrições de vídeos do YouTube pelo terminal.",
    stack: ["Python", "CLI"],
  },
];

export type TimelineItem = {
  date: string;
  title: string;
  sub: string;
  desc: string;
  /** Em andamento. */
  active?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    date: "2026 — Presente",
    title: "ATA Acre — Plataforma Documental & Transparência",
    sub: "Fundador & Mantenedor · ataacre.netlify.app",
    desc: "Criação da plataforma, apuração e análise de dados orçamentários públicos e desenvolvimento da infraestrutura.",
    active: true,
  },
  {
    date: "2026",
    title: "LexNode — Dados Públicos & TJAC",
    sub: "Web & CLI · Python & FastAPI",
    desc: "Interface e motor de pesquisa estruturada para dados públicos do Tribunal de Justiça do Acre (TJAC).",
  },
  {
    date: "2026",
    title: "Acre Acessibilidade — Concepção",
    sub: "Dados Abertos · LBI · WCAG",
    desc: "Sistema para auditar e mapear a acessibilidade digital e física em órgãos e espaços públicos do Acre, sob a LBI e com dados abertos.",
  },
  {
    date: "2026 — Presente",
    title: "Sistemas para Internet — IFAC",
    sub: "Instituto Federal do Acre · Campus Rio Branco · 2º Período",
    desc: "Ingresso em 2026. Cursando redes, desenvolvimento e álgebra matricial, com sistemas reais em paralelo ao curso.",
    active: true,
  },
  {
    date: "2026",
    title: "Fala Comigo v0.3.0 — Produção",
    sub: "App Android de CAA · GPL-3.0 · VirusTotal 0/72",
    desc: "App de comunicação para pessoas não verbais. Fork educacional feito por parceiro no RJ. Proposta classificada na 1ª fase do Programa Centelha (FAPEAC/FINEP).",
    active: true,
  },
  {
    date: "2024",
    title: "Certificação de Inglês — TOEFL ITP",
    sub: "Nível B2 (Intermediário Superior)",
    desc: "Comprovação de proficiência em compreensão auditiva, estrutura e expressão escrita e leitura.",
  },
  {
    date: "2023",
    title: 'Capacitação "Boas Práticas no Atendimento Público"',
    sub: "Diretoria de Organização em Centros de Atendimento — OCA",
    desc: "Linguagem Simples, Gestão da Qualidade, postura e comportamento no diálogo com o cidadão e Gestão da Informação.",
  },
];

export type Certificate = {
  id: string;
  title: string;
  institution: string;
  meta: string;
  code?: string;
  imgSrc: string;
  pdfHref?: string;
  isPdf?: boolean;
  /** Aparece na vitrine; os demais ficam em "Ver todos". */
  featured?: boolean;
};

export const certificates: Certificate[] = [
  {
    id: "cert-toefl",
    title: "Certificação de Inglês — TOEFL ITP (Nível B2)",
    institution: "Idiomas sem Fronteiras",
    meta: "Nível B2",
    imgSrc: "/components/certificados/preview-toefl.png",
    pdfHref: "/assets/pdf/isf-declaracao.pdf",
    isPdf: true,
    featured: true,
  },
  {
    id: "cert-sensoriamento",
    title: "Fundamentos das Plataformas de Sensoriamento Inteligente para Indústria",
    institution: "Cap.BR — VIRTUS",
    meta: "30 horas",
    imgSrc: "/components/certificados/preview-sensoriamento.png",
    pdfHref: "/assets/pdf/certificado-sensoriamento-inteligente.pdf",
    isPdf: true,
    featured: true,
  },
  {
    id: "cert-oca",
    title: "Boas Práticas no Atendimento Público",
    institution: "OCA — Governo do Acre",
    meta: "Capacitação",
    imgSrc: "/components/certificados/preview-oca.png",
    pdfHref: "/assets/pdf/certificado-servidorpublico.pdf",
    isPdf: true,
    featured: true,
  },
  {
    id: "cert-cyber-essencial",
    title: "Cibersegurança Essencial: Bases para Seus Projetos com Dados e IA",
    institution: "DIO / Bootcamp Bradesco",
    meta: "8 horas",
    code: "OAOWYSJQ",
    imgSrc: "/components/certificados/canvas.png",
    featured: true,
  },
  {
    id: "cert-sieli",
    title: "IV Seminário Internacional de Estudos Linguísticos e Internacionalização",
    institution: "SIELI — IFAC",
    meta: "10 horas",
    imgSrc: "/components/certificados/preview-sieli.png",
    pdfHref: "/assets/pdf/sieli-ifac-seminario-internacional-estudos-linguisticos-internacionalizacao.pdf",
    isPdf: true,
    featured: true,
  },
  {
    id: "cert-ia-moderna",
    title: "Fundamentos da IA Moderna: Machine Learning, LLMs, IA Generativa e Agentes",
    institution: "DIO / Bootcamp Bradesco",
    meta: "2 horas",
    code: "OEGPBSEG",
    imgSrc: "/components/certificados/canvas-7.png",
  },
  {
    id: "cert-llms",
    title: "Fundamentos de Modelos de Linguagem de Grande Escala (LLMs)",
    institution: "DIO / Bootcamp Bradesco",
    meta: "1 hora",
    code: "VCSGQIKT",
    imgSrc: "/components/certificados/canvas-6.png",
  },
  {
    id: "cert-principios-cyber",
    title: "Princípios da Cibersegurança",
    institution: "DIO / Bootcamp Bradesco",
    meta: "2 horas",
    code: "SRAPFZXY",
    imgSrc: "/components/certificados/canvas-5.png",
  },
  {
    id: "cert-dados-cyber",
    title: "Introdução à Coleta e Análise de Dados em Segurança Cibernética",
    institution: "DIO / Bootcamp Bradesco",
    meta: "2 horas",
    code: "FR6XK8KF",
    imgSrc: "/components/certificados/canvas-3.png",
  },
  {
    id: "cert-eng-social",
    title: "Tópicos em Engenharia Social",
    institution: "DIO / Bootcamp Bradesco",
    meta: "1 hora",
    code: "HYJVKEPB",
    imgSrc: "/components/certificados/canvas-2.png",
  },
  {
    id: "cert-devsecops",
    title: "Introdução ao DevSecOps",
    institution: "DIO / Bootcamp Bradesco",
    meta: "1 hora",
    code: "5CAAE2BP",
    imgSrc: "/components/certificados/canvas-1.png",
  },
  {
    id: "cert-so-vms",
    title: "Conceitos e Práticas de Sistemas Operacionais e Máquinas Virtuais",
    institution: "DIO / Bootcamp Bradesco",
    meta: "2 horas",
    code: "DMYI5T4H",
    imgSrc: "/components/certificados/canvas-4.png",
  },
  {
    id: "cert-bootcamp-bradesco",
    title: "Boas-vindas ao Bootcamp Bradesco - GenAI, Dados & Cyber",
    institution: "DIO / Bootcamp Bradesco",
    meta: "1 hora",
    code: "ADJECAOU",
    imgSrc: "/components/certificados/canvas-8.png",
  },
  {
    id: "cert-catedra",
    title: "Cátedra Abierta: Estudios sobre Metazoários Parasitos en el Acre",
    institution: "UAP · IFAC",
    meta: "2 horas",
    imgSrc: "/components/certificados/preview-catedra-abierta.png",
    pdfHref: "/assets/pdf/catedra-abierta-uap-ifac-metazoarios-parasitos.pdf",
    isPdf: true,
  },
  {
    id: "cert-nasa",
    title: "Nancy Grace Roman Space Telescope — Adote um Pixel",
    institution: "NASA",
    meta: "Pixel ID: 00634488",
    imgSrc: "/components/certificados/preview-nasa-roman.png",
  },
];

export const stackGroups = [
  {
    title: "Linguagens",
    badge: "Domínio & Uso Real",
    items: [
      "Python (automações, ETL, dados públicos)",
      "Kotlin (Android nativo: Jetpack Compose, Room, StateFlow)",
      "C & C++ (Linux, raylib, Wayland)",
      "TypeScript & JavaScript (Next.js, Web Components, Canvas 2D)",
      "Rust (wErpy)",
      "Shell / Bash & Makefile",
    ],
  },
  {
    title: "Mobile & Acessibilidade",
    badge: "Offline-first & LBI/WCAG",
    items: [
      "Android SDK & Jetpack Compose",
      "Arquitetura offline-first & Room",
      "Comunicação Alternativa e Aumentativa (CAA)",
      "Web Components (mascote Capi)",
      "Acessibilidade digital (LBI, WCAG 2.1 AA, leitores de tela)",
      "Síntese e reconhecimento de voz (TTS, Web Speech API)",
    ],
  },
  {
    title: "Engenharia Reversa & Segurança",
    badge: "Nível do Metal",
    items: [
      "Análise de binários ELF Linux 64-bit",
      "GDB, radare2 e Ghidra",
      "Assembly x86 / x86-64",
      "Criação de desafios didáticos de reversing",
    ],
  },
  {
    title: "Dados Públicos & Automação",
    badge: "ETL e Transparência",
    items: [
      "Coleta e automação web (Selenium, BeautifulSoup)",
      "FastAPI, PostgreSQL & DuckDB",
      "Integrações governamentais (PNCP, portais estaduais e municipais)",
      "n8n e alertas automáticos",
    ],
  },
  {
    title: "Graphics & Gamedev",
    badge: "Física & Procedural",
    items: [
      "HTML5 Canvas 2D e geração procedural",
      "C++ & raylib",
      "Godot Engine & GDScript",
      "Game loops em Kotlin (Android)",
    ],
  },
];

export const bioInfo = {
  name: "Willian Albarello",
  role: "Engenheiro de Software & Sistemas",
  summary:
    "Engenheiro de software e criador de sistemas. Desenvolvo tecnologia assistiva e acessibilidade (proposta selecionada na 1ª fase do Programa Centelha/FINEP), sistemas para transparência pública e dados abertos (como a plataforma documental ATA Acre). Crio também engines de jogos procedurais (Fourier e Perlin em C++), ferramentas de engenharia reversa (Linux ELF) e arquiteturas em Rust, Kotlin e TypeScript.",
  badges: ["Rio Branco, Acre", "IFAC · 2º Período"],
  availability: "Aberto para freelas e colaborações",
  responseTime: "Resposta em até 24h · UTC−5",
  links: {
    github: "https://github.com/walbarellos",
    ataacre: "https://ataacre.netlify.app",
    lattes: "http://lattes.cnpq.br/1326474169012655",
    publishedPage: "https://walbarellos.is-a.dev",
    falacomigo: "https://falacomigo-br.netlify.app/",
    lexnode: "https://github.com/walbarellos/LexNode",
    mastodon: "https://mastodon.social/@walbarellos",
    email: "willianalbarello@gmail.com",
  },
};
