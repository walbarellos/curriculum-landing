import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { Certificate, Project, ProjectCategory } from "@/data/portfolio";
import { LANGS, detectLang, localize, parseLang, ui } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { LangSwitch, LangToast, PrintSheet, PrintToolbar } from "@/components/portfolio-extras";
import { HeroPortrait } from "@/components/hero-portrait";

type AcreAcessivelApi = {
  init: (opts: { libras: boolean }) => void;
  setLanguage?: (lang: string) => void;
  readBlocks?: (
    blocks: { id?: string; elementId?: string; text: string }[],
    startIndex?: number,
    onBlockStart?: (idx: number, block: any) => void,
    onComplete?: () => void
  ) => void;
  stop?: () => void;
  pause?: () => void;
  resume?: () => void;
  reader?: any;
};
type CapiWindow = Window & {
  AcreAcessivelConfig?: { backendUrl: string };
  AcreAcessivel?: AcreAcessivelApi;
};

const SECTION_IDS = ["projetos", "stack", "certificados", "historia", "contato"];

function setHtml(attr: string, value: string) {
  document.documentElement.setAttribute(attr, value);
}

/** Aplica idioma no <html>: lang, dir (RTL para hebraico), título e descrição. */
function applyLang(l: Lang) {
  const meta = LANGS.find((x) => x.id === l) ?? LANGS[0];
  const root = document.documentElement;
  root.setAttribute("lang", meta.html);
  root.setAttribute("dir", meta.dir);
  document.title = ui[l].docTitle;
  document.querySelector('meta[name="description"]')?.setAttribute("content", ui[l].docDesc);
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const delay = (ms: number): CSSProperties => ({ ["--d" as string]: `${ms}ms` });

/* ───────────── Peças reutilizáveis ───────────── */

function SectionHead({
  id,
  num,
  title,
  sub,
}: {
  id?: string;
  num: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="reveal">
      <div className="flex items-end gap-4">
        <h2 id={id} className="sec-title">
          {title}
        </h2>
        <span className="connector" aria-hidden="true" />
        <span className="sec-num" aria-hidden="true">
          {num}
        </span>
      </div>
      {sub && <p className="sec-sub mt-3 max-w-2xl">{sub}</p>}
    </div>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    const t = window.setInterval(() => setI((v) => (v + 1) % words.length), 2600);
    return () => window.clearInterval(t);
  }, [words.length]);

  if (still) return <span className="text-accent font-semibold">{words.join(", ")}</span>;
  return (
    <span className="word-slot" aria-hidden="true">
      <span key={i} className="word-swap">
        {words[i]}
      </span>
    </span>
  );
}

function _ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      className="underline font-medium hover:text-accent inline-flex items-center gap-1"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span>{children}</span>
      <span className="text-xs text-muted" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function Chips({
  stack,
  selected,
  onPick,
  label,
  small,
}: {
  stack: string[];
  selected: string | null;
  onPick: (t: string) => void;
  label: (tech: string) => string;
  small?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${small ? "" : "mt-4"}`}>
      {stack.map((tech) => (
        <button
          key={tech}
          type="button"
          className="chip"
          dir="ltr"
          aria-pressed={selected === tech}
          title={label(tech)}
          onClick={() => onPick(tech)}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}

/** Título de sistema: sempre o mesmo visual. Com link, o card inteiro é clicável. */
function SysTitle({ p, className }: { p: Project; className?: string }) {
  return (
    <h3 className={className}>
      {p.href ? (
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="no-underline hover:text-accent after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          {p.name}
          <span className="ml-1.5 text-xs text-muted" aria-hidden="true">
            ↗
          </span>
        </a>
      ) : (
        <span>{p.name}</span>
      )}
    </h3>
  );
}

/* ───────────── Página ───────────── */

export function Portfolio() {
  // Idioma (pt é o padrão do SSR; o escolhido/detectado entra após montar)
  const [lang, setLang] = useState<Lang>("pt");
  const [suggest, setSuggest] = useState<"en" | "he" | null>(null);
  const t = ui[lang];
  const L = useMemo(() => localize(lang), [lang]);
  const { bioInfo, categories, certificates, projects, stackGroups, timeline } = L;

  // Modo impressão
  const [printMode, setPrintMode] = useState(false);
  const printBtnRef = useRef<HTMLButtonElement>(null);
  const printOpenerRef = useRef<HTMLButtonElement>(null);

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [activeSection, setActiveSection] = useState<string>("projetos");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCerts, setShowAllCerts] = useState(false);

  const [qrMode, setQrMode] = useState<"curriculo" | "github">("curriculo");
  const [lightboxCert, setLightboxCert] = useState<Certificate | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Contato
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ nome: "", assunto: 0, mensagem: "" });

  // Barra de acessibilidade (altura variável → nav sticky logo abaixo)
  const barRef = useRef<HTMLElement>(null);
  const [barH, setBarH] = useState(44);

  // Menu com indicador deslizante
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState({ left: 0, width: 0 });

  const tlRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  // Leitor de voz
  const [readingState, setReadingState] = useState<"idle" | "reading" | "paused">("idle");
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [totalBlocks, setTotalBlocks] = useState<number>(0);
  const [readingSnippet, setReadingSnippet] = useState<string>("");
  const speechBlocksRef = useRef<{ id: string; text: string; elementId?: string }[]>([]);
  const currentIndexRef = useRef<number>(0);

  const techs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.stack.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [projects]);

  // Tema & contraste salvos
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("wa-theme");
      const nextTheme = savedTheme === "dark" ? "dark" : "light";
      setTheme(nextTheme);
      if (nextTheme === "dark") setHtml("data-theme", "dark");

      if (localStorage.getItem("wa-contrast") === "1") {
        setHtml("data-contrast", "high");
      }
    } catch {
      /* storage indisponível */
    }
  }, []);

  // Idioma: ?lang= → salvo → convite no idioma do navegador (nunca troca sozinho)
  useEffect(() => {
    let saved: Lang | null = null;
    try {
      saved =
        parseLang(new URLSearchParams(window.location.search).get("lang")) ??
        parseLang(localStorage.getItem("wa-lang"));
    } catch {
      /* storage indisponível */
    }
    if (saved) {
      setLang(saved);
      applyLang(saved);
      return;
    }
    const d = detectLang();
    if (d === "en" || d === "he") {
      let dismissed = false;
      try {
        dismissed = localStorage.getItem("wa-lang-dismissed") === "1";
      } catch {
        /* ignore */
      }
      if (!dismissed) setSuggest(d);
    }
  }, []);

  // Ctrl+P também imprime a folha limpa; o título vira o nome sugerido do PDF
  useEffect(() => {
    const before = () => {
      document.title = ui[lang].printDocTitle;
    };
    const after = () => {
      document.title = ui[lang].docTitle;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [lang]);

  // Modo impressão: foco no botão de imprimir; Esc sai
  useEffect(() => {
    if (!printMode) return;
    printBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitPrintMode();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [printMode]);

  // Capi (mascote Acre Acessível): carregamento único + init
  useEffect(() => {
    const w = window as CapiWindow;
    w.AcreAcessivelConfig = { backendUrl: "" };

    const init = () => {
      try {
        w.AcreAcessivel?.init({ libras: false });
        const speechLang = LANGS.find((l) => l.id === lang)?.speech ?? "pt-BR";
        w.AcreAcessivel?.setLanguage?.(speechLang);
      } catch (e) {
        console.warn("Capi init warning:", e);
      }
    };

    if (document.getElementById("capi-script")) {
      init();
      return;
    }
    const script = document.createElement("script");
    script.id = "capi-script";
    script.src = "/js/acessibilidade.js";
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, []);

  // Altura da barra de acessibilidade
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reveal ao rolar
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scrollspy
  useEffect(() => {
    const sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Indicador deslizante do menu
  useEffect(() => {
    const update = () => {
      const el = navRefs.current[activeSection];
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => window.removeEventListener("resize", update);
  }, [activeSection]);

  // Scroll: barra de progresso + linha do tempo
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progRef.current?.style.setProperty("--sp", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");

      const el = tlRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Spotlight, tilt e botões magnéticos (só mouse fino e sem "reduzir movimento")
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      const e = last;
      const t = e?.target as Element | null;
      if (!e || !t || !(t instanceof Element)) return;

      const card = t.closest<HTMLElement>("[data-fx]");
      if (card) {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        if (card.hasAttribute("data-tilt")) {
          const max = Number(card.dataset.tilt) || 5;
          card.style.setProperty("--ry", `${((x / r.width - 0.5) * max * 2).toFixed(2)}deg`);
          card.style.setProperty("--rx", `${(-(y / r.height - 0.5) * max * 2).toFixed(2)}deg`);
        }
      }

      const btn = t.closest<HTMLElement>("[data-magnet]");
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.setProperty("--tx", `${dx.toFixed(1)}px`);
        btn.style.setProperty("--ty", `${dy.toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      const el = t.closest<HTMLElement>("[data-tilt],[data-magnet]");
      if (el && !el.contains(e.relatedTarget as Node | null)) {
        ["--rx", "--ry", "--tx", "--ty"].forEach((p) => el.style.removeProperty(p));
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lightbox nativo (<dialog>): Esc, focus-trap e retorno de foco já vêm do navegador
  useEffect(() => {
    const d = dialogRef.current;
    if (lightboxCert && d && !d.open) d.showModal();
  }, [lightboxCert]);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") setHtml("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("wa-theme", next);
    } catch {
      /* ignore */
    }
  }

  function changeLang(next: Lang) {
    if (next === lang) return;
    stopReading();
    setLang(next);
    applyLang(next);
    const speechLang = LANGS.find((l) => l.id === next)?.speech ?? "pt-BR";
    const w = window as CapiWindow;
    w.AcreAcessivel?.setLanguage?.(speechLang);
    setSuggest(null);
    try {
      localStorage.setItem("wa-lang", next);
    } catch {
      /* ignore */
    }
    if (!prefersReducedMotion()) {
      const root = document.documentElement;
      root.classList.remove("lang-fx");
      void root.offsetWidth; // reinicia a animação
      root.classList.add("lang-fx");
      window.setTimeout(() => root.classList.remove("lang-fx"), 700);
    }
  }

  function dismissSuggest() {
    setSuggest(null);
    try {
      localStorage.setItem("wa-lang-dismissed", "1");
    } catch {
      /* ignore */
    }
  }

  function enterPrintMode() {
    stopReading();
    setHtml("data-print", "on");
    setPrintMode(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function exitPrintMode() {
    document.documentElement.removeAttribute("data-print");
    setPrintMode(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    printOpenerRef.current?.focus();
  }

  function toggleTech(t: string) {
    setSelectedTech((prev) => (prev === t ? null : t));
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(bioInfo.links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${bioInfo.links.email}`;
    }
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();
    const subject = `${t.mailPrefix} ${t.subjects[form.assunto]}${form.nome ? ` — ${form.nome}` : ""}`;
    const body = `${form.mensagem}\n\n— ${form.nome || t.noName}`;
    setSending(true);
    window.setTimeout(() => setSending(false), 2500);
    window.location.href = `mailto:${bioInfo.links.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  // Lightbox: navegar entre certificados em imagem
  const imageCerts = certificates.filter((c) => !c.pdfHref);
  function stepCert(dir: 1 | -1) {
    if (!lightboxCert) return;
    const i = imageCerts.findIndex((c) => c.id === lightboxCert.id);
    if (i < 0) return;
    setLightboxCert(imageCerts[(i + dir + imageCerts.length) % imageCerts.length]);
  }

  // ───── Leitor de voz com feedback visual ─────
  function stopReading() {
    const w = window as CapiWindow;
    try {
      w.AcreAcessivel?.stop?.();
    } catch {
      /* ignore */
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document.querySelectorAll(".reading-active").forEach((el) => el.classList.remove("reading-active"));
    setReadingState("idle");
    setCurrentBlockIndex(0);
    setReadingSnippet("");
  }

  function pauseReading() {
    const w = window as CapiWindow;
    try {
      w.AcreAcessivel?.pause?.();
    } catch {
      /* ignore */
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    setReadingState("paused");
  }

  function resumeReading() {
    const w = window as CapiWindow;
    try {
      w.AcreAcessivel?.resume?.();
    } catch {
      /* ignore */
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
    setReadingState("reading");
  }

  function playBlock(index: number) {
    const blocks = speechBlocksRef.current;
    if (index >= blocks.length) {
      stopReading();
      return;
    }
    currentIndexRef.current = index;
    setCurrentBlockIndex(index + 1);

    const block = blocks[index];
    setReadingSnippet(block.text.slice(0, 70) + (block.text.length > 70 ? "..." : ""));

    document.querySelectorAll(".reading-active").forEach((el) => el.classList.remove("reading-active"));
    if (block.elementId) {
      const el = document.getElementById(block.elementId);
      if (el) {
        el.classList.add("reading-active");
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      }
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(block.text);
      utterance.lang = LANGS.find((l) => l.id === lang)?.speech ?? "pt-BR";
      utterance.rate = 1.05;
      utterance.onend = () => playBlock(index + 1);
      utterance.onerror = () => stopReading();
      window.speechSynthesis.speak(utterance);
    }
  }

  function startReading() {
    const w = window as CapiWindow;
    const speechLang = LANGS.find((l) => l.id === lang)?.speech ?? "pt-BR";
    w.AcreAcessivel?.setLanguage?.(speechLang);

    if (!w.AcreAcessivel?.readBlocks && !("speechSynthesis" in window)) {
      alert(t.speechUnsupported);
      return;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    const blocks: { id: string; text: string; elementId?: string }[] = [];

    if (document.getElementById("topo")) {
      blocks.push({
        id: "header",
        elementId: "topo",
        text: `${bioInfo.name}. ${bioInfo.role}. ${bioInfo.summary}`,
      });
    }
    if (document.getElementById("projetos-titulo")) {
      blocks.push({
        id: "sec-projetos",
        elementId: "projetos-titulo",
        text: t.readSystems,
      });
    }
    projects
      .filter((p) => p.featured)
      .forEach((p) => {
        const pEl = document.getElementById(`proj-${p.id}`);
        blocks.push({
          id: `p-${p.id}`,
          elementId: pEl ? `proj-${p.id}` : undefined,
          text: t.readSystem(p.name, p.categoryLabel, p.summary, p.stack.join(", ")),
        });
      });
    if (document.getElementById("stack")) {
      const stackText = stackGroups.map((g) => `${g.title}: ${g.items.join(", ")}.`).join(" ");
      blocks.push({ id: "sec-stack", elementId: "stack", text: t.readStack(stackText) });
    }
    if (document.getElementById("certificados")) {
      blocks.push({
        id: "sec-certificados",
        elementId: "certificados",
        text: t.readCerts,
      });
    }
    if (document.getElementById("historia")) {
      blocks.push({
        id: "sec-historia",
        elementId: "historia",
        text: t.readHistory,
      });
    }
    if (document.getElementById("contato")) {
      blocks.push({
        id: "sec-contato",
        elementId: "contato",
        text: t.readContact(bioInfo.links.email),
      });
    }

    speechBlocksRef.current = blocks;
    setTotalBlocks(blocks.length);
    setReadingState("reading");

    if (w.AcreAcessivel?.readBlocks) {
      w.AcreAcessivel.readBlocks(
        blocks,
        0,
        (idx, block) => {
          currentIndexRef.current = idx;
          setCurrentBlockIndex(idx + 1);
          setReadingSnippet(block.text.slice(0, 70) + (block.text.length > 70 ? "..." : ""));
          document.querySelectorAll(".reading-active").forEach((el) => el.classList.remove("reading-active"));
          if (block.elementId) {
            const el = document.getElementById(block.elementId);
            if (el) {
              el.classList.add("reading-active");
              el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
            }
          }
        },
        () => {
          stopReading();
        }
      );
    } else {
      playBlock(0);
    }
  }

  // ───── Derivados ─────
  const matches = (p: Project) =>
    (selectedCategory === "all" || p.category === selectedCategory) &&
    (!selectedTech || p.stack.includes(selectedTech));
  const filtered = projects.filter(matches);
  const mainList = filtered.filter((p) => p.featured);
  const restList = filtered.filter((p) => !p.featured);
  const filtering = selectedCategory !== "all" || selectedTech !== null;
  const restVisible = filtering || showAllProjects;
  const shownCount = mainList.length + (restVisible ? restList.length : 0);

  const featuredCerts = certificates.filter((c) => c.featured);
  const visibleCerts = showAllCerts ? certificates : featuredCerts;
  const dioCount = L.dio.count;
  const dioHours = L.dio.hours;

  const navItems: [string, string][] = [
    ["projetos", t.nav.projetos],
    ["stack", t.nav.stack],
    ["certificados", t.nav.certificados],
    ["historia", t.nav.historia],
    ["contato", t.nav.contato],
  ];

  const socials: { label: string; handle: string; href: string }[] = [
    { label: "GitHub", handle: "github.com/walbarellos", href: bioInfo.links.github },
    { label: "LinkedIn", handle: "willian-albarello", href: bioInfo.links.linkedin },
    { label: "Lattes", handle: "ID 1326474169012655", href: bioInfo.links.lattes },
    { label: "Mastodon", handle: "@walbarellos", href: bioInfo.links.mastodon },
    { label: "CrackLab", handle: "crack-lab.vercel.app", href: bioInfo.links.cracklab },
    { label: "Fala Comigo", handle: "falacomigo-br.netlify.app", href: bioInfo.links.falacomigo },
  ];

  return (
    <>
      <div className="screen-only min-h-screen bg-bg text-fg antialiased transition-colors duration-150 relative">
        <div ref={progRef} className="scroll-progress" aria-hidden="true" />
        <a className="skip-link" href="#conteudo">
          {t.skip}
        </a>

        {/* Barra de acessibilidade e ferramentas */}
        <aside
          ref={barRef}
          aria-label={t.a11yBarAria}
          className="accessibility-bar border-b border-line/20 bg-surface/90 sticky top-0 z-40 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 text-sm flex-wrap md:flex-nowrap">
            {/* Esquerda: Seletor de Idioma */}
            <LangSwitch lang={lang} onChange={changeLang} />

            {/* Direita: Controles integrados em uma única linha harmoniosa */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
              {/* Leitor de Voz Capi */}
              {readingState === "idle" ? (
                <button
                  type="button"
                  data-acre-ignore="true"
                  className="h-8 px-2.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 bg-surface-2 hover:bg-accent hover:text-accent-fg border border-line/20 hover:border-accent transition-all duration-150"
                  onClick={startReading}
                  title={t.readPageTitle}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>{t.readPage}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  {readingState === "reading" ? (
                    <button
                      type="button"
                      data-acre-ignore="true"
                      className="h-8 px-2.5 rounded-md text-xs font-bold inline-flex items-center gap-1.5 bg-accent text-accent-fg border border-accent shadow-xs"
                      onClick={pauseReading}
                      title={t.pauseTitle}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <line x1="6" y1="4" x2="6" y2="20" />
                        <line x1="18" y1="4" x2="18" y2="20" />
                      </svg>
                      <span>{t.pause}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-acre-ignore="true"
                      className="h-8 px-2.5 rounded-md text-xs font-bold inline-flex items-center gap-1.5 bg-accent/90 text-accent-fg border border-accent"
                      onClick={resumeReading}
                      title={t.resumeTitle}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>{t.resume}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    data-acre-ignore="true"
                    className="h-8 px-2 rounded-md text-xs inline-flex items-center gap-1 text-muted hover:text-fg hover:bg-surface-2 border border-line/20"
                    onClick={stopReading}
                    title={t.stopTitle}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" />
                    </svg>
                    <span>{t.stop}</span>
                  </button>
                </div>
              )}

              {/* Tema Escuro / Claro */}
              <button
                type="button"
                className="h-8 px-2.5 text-xs font-medium rounded-md border border-line/20 hover:border-line hover:bg-surface-2 text-muted hover:text-fg inline-flex items-center gap-1.5 transition-all"
                onClick={toggleTheme}
                title={theme === "light" ? t.themeDark : t.themeLight}
              >
                {theme === "light" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <span className="hidden sm:inline">{t.themeDark}</span>
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    <span className="hidden sm:inline">{t.themeLight}</span>
                  </>
                )}
              </button>

              {/* Modo Impressão */}
              <button
                ref={printOpenerRef}
                type="button"
                className="h-8 px-2.5 text-xs font-semibold rounded-md border border-line/25 hover:border-line hover:bg-surface-2 text-muted hover:text-fg inline-flex items-center gap-1.5 transition-all"
                onClick={enterPrintMode}
                title={t.printTitle}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9V3h12v6M6 18H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2" />
                  <rect x="6" y="14" width="12" height="7" />
                </svg>
                <span className="hidden sm:inline">{t.print}</span>
              </button>
            </div>
          </div>

          {readingState !== "idle" && (
            <div
              role="status"
              aria-live="polite"
              className="border-t border-line/20 bg-surface-2 px-4 py-2 text-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 truncate">
                {readingState === "reading" ? (
                  <div className="flex items-center gap-1 h-3" aria-hidden="true">
                    <span className="soundwave-bar" />
                    <span className="soundwave-bar" />
                    <span className="soundwave-bar" />
                    <span className="soundwave-bar" />
                  </div>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-muted" />
                )}
                <span className="font-semibold text-accent whitespace-nowrap">
                  {t.reading} ({currentBlockIndex}/{totalBlocks}):
                </span>
                <span className="truncate text-muted italic">"{readingSnippet}"</span>
              </div>
              <span className="text-[11px] font-mono text-muted whitespace-nowrap">
                {readingState === "paused" ? t.paused : t.playing}
              </span>
            </div>
          )}
        </aside>
        <main id="conteudo" className="mx-auto max-w-5xl px-4 pb-10 pt-12">
          {/* Hero */}
          <header
            id="topo"
            className="grid grid-cols-1 items-end gap-10 border-b border-line pb-12 md:grid-cols-[1fr_auto]"
          >
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2.5 reveal">
                {bioInfo.badges.map((b, idx) => {
                  const isLocation = idx === 0;
                  return (
                    <span
                      key={b}
                      tabIndex={0}
                      role="status"
                      className={`badge-interactive ${
                        isLocation ? "badge-interactive-location" : "badge-interactive-academic"
                      }`}
                      title={isLocation ? "Localizacao atual · Amazonia Ocidental" : "Instituto Federal do Acre · Formacao academica"}
                    >
                      <span
                        className={`badge-indicator-dot ${
                          isLocation
                            ? "bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-amber-600 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{b}</span>
                    </span>
                  );
                })}
              </div>

              <h1 className="hero-title" aria-label={bioInfo.name}>
                {bioInfo.name.split(" ").map((word, i) => (
                  <span key={word} className="mask-line" aria-hidden="true">
                    <span style={delay(120 + i * 140)}>{word}</span>
                  </span>
                ))}
              </h1>

              <p className="sec-sub mt-5 reveal" style={delay(500)}>
                {bioInfo.role}
              </p>
              <p className="mt-3 font-mono text-sm reveal" style={delay(560)}>
                <span className="sr-only">{t.systemsFor} {t.heroWords.join(", ")}.</span>
                <span aria-hidden="true">{t.systemsFor} </span>
                <RotatingWord words={t.heroWords} />
              </p>
              <p className="mt-4 max-w-xl text-muted leading-relaxed reveal" style={delay(620)}>
                {bioInfo.summary}
              </p>

              <div className="no-print mt-7 flex flex-wrap items-center gap-3 reveal" style={delay(700)}>
                <a className="btn btn-primary" data-magnet href="#projetos">
                  {t.viewSystems} <span className="arrow" aria-hidden="true">↓</span>
                </a>
                <a className="btn btn-ghost" data-magnet href="#contato">
                  {t.talk} <span className="arrow" aria-hidden="true">↗</span>
                </a>
                <a
                  className="btn btn-ghost"
                  data-magnet
                  href="/assets/pdf/Willian_Albarello_Curriculo.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.resumePdf} <span className="arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-center">
              <HeroPortrait
                alt={t.photoAlt(bioInfo.name)}
                className="h-56 w-48 sm:h-72 sm:w-56 md:h-80 md:w-60"
              />
              <span className="mt-2 text-[11px] text-muted font-mono">{t.lattes}: 1326474169012655</span>
            </div>
          </header>

          {/* Marquee de tecnologias */}
          <div className="marquee my-8 no-print" aria-hidden="true">
            <div className="marquee-track">
              <div className="marquee-group">
                {techs.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="marquee-group" data-dup>
                {techs.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav
            aria-label={t.navAria}
            style={{ top: barH }}
            className="sticky z-30 flex flex-nowrap items-center gap-x-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-line bg-bg/95 py-3 text-sm backdrop-blur-md"
          >
            {navItems.map(([id, label]) => (
              <a
                key={id}
                ref={(el) => {
                  navRefs.current[id] = el;
                }}
                className="nav-link whitespace-nowrap"
                href={`#${id}`}
                aria-current={activeSection === id ? "true" : undefined}
              >
                {label}
              </a>
            ))}
            <span className="nav-indicator" style={{ left: ind.left, width: ind.width }} aria-hidden="true" />
          </nav>

          {/* Sistemas */}
          <section id="projetos" className="border-b border-line py-14">
            <SectionHead
              id="projetos-titulo"
              num="01"
              title={t.nav.projetos}
              sub={t.sysSub}
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between reveal">
              <div role="group" aria-label={t.filterAria} className="filter-pills flex flex-wrap gap-2 text-xs">
                {categories.map((cat) => {
                  const count =
                    cat.id === "all" ? projects.length : projects.filter((p) => p.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded border transition-all ${
                        isSelected
                          ? "bg-accent text-accent-fg border-accent font-semibold shadow-sm"
                          : "bg-surface-2 border-line/30 text-fg hover:border-line"
                      }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono text-muted" role="status" aria-live="polite">
                {t.showing(shownCount, filtered.length)}
              </span>
            </div>

            {selectedTech && (
              <p className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted">{t.techLabel}</span>
                <span className="chip" aria-hidden="true" style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}>
                  {selectedTech}
                </span>
                <button
                  type="button"
                  className="rounded border border-line/30 px-2 py-0.5 text-xs hover:border-line"
                  onClick={() => setSelectedTech(null)}
                >
                  {t.clearFilter}
                </button>
              </p>
            )}

            <div key={`${selectedCategory}-${selectedTech}`} className="mt-6">
              {mainList.length === 0 && restList.length === 0 && (
                <p className="text-muted">{t.noMatch}</p>
              )}

              {mainList.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {mainList.map((p, i) => (
                    <li
                      key={p.id}
                      id={`proj-${p.id}`}
                      style={delay(i * 60)}
                      data-fx
                      className="interactive-card sys-card fx pop-in flex flex-col rounded border border-line/25 bg-surface/50 p-5 pt-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="sys-index" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-right font-mono text-[11px] font-medium uppercase tracking-wider text-muted">
                          {p.kind}
                        </span>
                      </div>
                      <SysTitle p={p} className="mt-3 text-xl font-bold leading-snug" />
                      {p.highlight && (
                        <span className="mt-2 inline-block self-start rounded bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                          {p.highlight}
                        </span>
                      )}
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">{p.summary}</p>
                      <Chips stack={p.stack} selected={selectedTech} onPick={toggleTech} label={t.filterBy} />
                    </li>
                  ))}
                </ul>
              )}

              {restVisible && restList.length > 0 && (
                <div className={mainList.length ? "mt-10" : ""}>
                  {mainList.length > 0 && (
                    <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                      {t.others}
                    </h3>
                  )}
                  <ul className="border-t border-line/25">
                    {restList.map((p, i) => (
                      <li
                        key={p.id}
                        id={`proj-${p.id}`}
                        style={delay(i * 40)}
                        className="row-item pop-in relative flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line/20 py-3"
                      >
                        <SysTitle p={p} className="min-w-[10rem] flex-1 font-bold" />
                        {p.private && (
                          <span className="rounded border border-line/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                            {t.private}
                          </span>
                        )}
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{p.kind}</span>
                        <Chips stack={p.stack} selected={selectedTech} onPick={toggleTech} label={t.filterBy} small />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!filtering && restList.length > 0 && (
                <div className="no-print mt-6 flex justify-center">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    data-magnet
                    aria-expanded={showAllProjects}
                    onClick={() => setShowAllProjects((v) => !v)}
                  >
                    {showAllProjects ? t.showLess : t.showAllProjects(restList.length)}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Stack */}
          <section id="stack" className="border-b border-line py-14">
            <SectionHead num="02" title={t.stackTitle} sub={t.stackSub} />

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {stackGroups.map((g, i) => (
                <div
                  key={g.title}
                  data-fx
                  style={delay((i % 2) * 90)}
                  className="stack-group-card fx reveal rounded border border-line/25 bg-surface-2/40 p-4"
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-line/20 pb-2">
                    <h3 className="font-bold text-fg">{g.title}</h3>
                    <span className="rounded bg-surface-3 px-2 py-0.5 font-mono text-[11px] text-muted">{g.badge}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-xs font-bold text-accent" aria-hidden="true">
                          ▸
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Certificados */}
          <section id="certificados" className="border-b border-line py-14">
            <SectionHead
              num="03"
              title={t.certTitle}
              sub={t.certSub(dioCount, dioHours)}
            />

            <div key={String(showAllCerts)} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCerts.map((cert, i) => {
                const thumb = (
                  <>
                    <img
                      src={cert.imgSrc}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-xs font-medium text-white opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {cert.pdfHref ? t.openPdf : t.enlarge}
                    </span>
                    {cert.isPdf && (
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white">
                        PDF
                      </span>
                    )}
                  </>
                );
                const thumbClass =
                  "group relative block aspect-[4/3] w-full overflow-hidden bg-surface-2 text-left";
                return (
                  <article
                    key={cert.id}
                    data-fx
                    data-tilt="4"
                    style={delay(i * 40)}
                    className="cert-card fx fx-tilt pop-in flex flex-col justify-between rounded border border-line/20 bg-surface/40"
                  >
                    {cert.pdfHref ? (
                      <a
                        className={thumbClass}
                        href={cert.pdfHref}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t.openPdfAria(cert.title)}
                      >
                        {thumb}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={thumbClass}
                        onClick={() => setLightboxCert(cert)}
                        aria-label={t.enlargeAria(cert.title)}
                      >
                        {thumb}
                      </button>
                    )}

                    <div className="flex flex-1 flex-col justify-between p-3.5">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-fg">{cert.title}</h3>
                        <p className="mt-1 text-xs text-muted">{cert.institution}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-line/10 pt-2.5 font-mono text-xs">
                        <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-accent">
                          {cert.meta}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="no-print mt-6 flex justify-center">
              <button
                type="button"
                className="btn btn-ghost"
                data-magnet
                aria-expanded={showAllCerts}
                onClick={() => setShowAllCerts((v) => !v)}
              >
                {showAllCerts ? t.showLess : t.showAllCerts(certificates.length)}
              </button>
            </div>
          </section>

          {/* Histórico */}
          <section id="historia" className="border-b border-line py-14">
            <SectionHead num="04" title={t.histTitle} sub={t.histSub} />

            <div ref={tlRef} className="tl mt-10 space-y-8 pl-9">
              {timeline.map((item, idx) => (
                <div key={idx} className="tl-item reveal relative">
                  <div
                    aria-hidden="true"
                    className="tl-dot absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2"
                  />
                  <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide text-accent">
                    {item.date}
                    {item.active && (
                      <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] tracking-wider">{t.ongoing}</span>
                    )}
                  </span>
                  <h3 className="mt-0.5 text-lg font-bold text-fg">{item.title}</h3>
                  <p className="mt-0.5 font-mono text-xs text-muted">{item.sub}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contato */}
          <section id="contato" className="py-14">
            <SectionHead num="05" title={t.contactTitle} sub={bioInfo.availability} />

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div className="reveal">
                <p className="inline-flex items-center gap-2 rounded-full border border-line/30 bg-surface-2/60 px-3 py-1 font-mono text-xs">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                  </span>
                  {bioInfo.responseTime}
                </p>

                <p className="mt-5 max-w-md text-muted">
                  {t.contactIntro}
                </p>

                <div className="mt-6 flex flex-wrap items-stretch gap-3">
                  <a
                    className="btn btn-primary font-mono normal-case tracking-normal"
                    dir="ltr"
                    data-magnet
                    href={`mailto:${bioInfo.links.email}`}
                  >
                    {bioInfo.links.email} <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                  <button type="button" className="btn btn-ghost no-print" data-magnet onClick={copyEmail}>
                    {copied ? t.copied : t.copyEmail}
                  </button>
                  <span className="sr-only" role="status" aria-live="polite">
                    {copied ? t.copiedSr : ""}
                  </span>
                </div>

                <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded border border-line/25 bg-line/25 sm:grid-cols-2">
                  {socials.map((s) => (
                    <li key={s.label} className="bg-bg">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="social-link group flex items-center justify-between gap-3 px-4 py-3 no-underline"
                      >
                        <span>
                          <span className="block text-sm font-bold text-fg">{s.label}</span>
                          <span dir="ltr" className="block font-mono text-[11px] text-muted">{s.handle}</span>
                        </span>
                        <span
                          className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <form onSubmit={submitForm} className="no-print reveal space-y-4" style={delay(100)}>
                  <h3 className="text-lg font-bold">{t.quick}</h3>
                  <div className="field-wrap">
                    <label htmlFor="f-nome" className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                      {t.fName}
                    </label>
                    <input
                      id="f-nome"
                      className="field"
                      autoComplete="name"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </div>
                  <div className="field-wrap">
                    <label htmlFor="f-assunto" className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                      {t.fSubject}
                    </label>
                    <select
                      id="f-assunto"
                      className="field"
                      value={form.assunto}
                      onChange={(e) => setForm({ ...form, assunto: Number(e.target.value) })}
                    >
                      {t.subjects.map((s, i) => (
                        <option key={s} value={i}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-wrap">
                    <label htmlFor="f-msg" className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted">
                      {t.fMessage}
                    </label>
                    <textarea
                      id="f-msg"
                      className="field min-h-28"
                      required
                      value={form.mensagem}
                      onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" data-magnet disabled={sending}>
                    {sending ? t.sending : t.send}{" "}
                    <span className="arrow" aria-hidden="true">↗</span>
                  </button>
                  <p className="text-xs text-muted">{t.sendHint}</p>
                </form>

                <div className="qr-block reveal flex items-center gap-5 rounded border border-line/30 bg-surface-2/30 p-4" style={delay(160)}>
                  <div className="flex flex-col items-center">
                    <img
                      src={qrMode === "curriculo" ? "/qr-curriculo.svg" : "/qr-github.svg"}
                      alt={
                        qrMode === "curriculo"
                          ? t.qrAltResume
                          : t.qrAltGithub
                      }
                      width={112}
                      height={112}
                      className="h-28 w-28 rounded border border-line/20 bg-white p-1 shadow-sm"
                    />
                    <span className="mt-1 font-mono text-[11px] text-muted">
                      {qrMode === "curriculo" ? "walbarellos-paper" : "github.com"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted">
                      {qrMode === "curriculo"
                        ? t.qrDescResume
                        : t.qrDescGithub}
                    </p>
                    <button
                      type="button"
                      className="qr-switcher-buttons btn btn-ghost !px-3 !py-1.5 !text-[11px]"
                      onClick={() => setQrMode(qrMode === "curriculo" ? "github" : "curriculo")}
                    >
                      {qrMode === "curriculo" ? t.qrSwitchGithub : t.qrSwitchResume}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-14 border-t border-line/20 pt-8 text-center text-xs italic leading-relaxed text-muted/80">
              {t.quote}
            </p>

            <footer className="mt-6 flex flex-col items-center justify-between gap-2 font-mono text-xs text-muted sm:flex-row">
              <span>{t.rights}</span>
              <span className="flex items-center gap-4">
                <span>{t.updated}</span>
                <a className="no-print underline" href="#topo">
                  {t.top}
                </a>
              </span>
            </footer>
          </section>
        </main>

        {/* Lightbox de certificados */}
        {lightboxCert && (
          <dialog
            ref={dialogRef}
            className="lightbox"
            aria-label={t.lbAria(lightboxCert.title)}
            onClose={() => setLightboxCert(null)}
            onClick={(e) => {
              if (e.target === dialogRef.current) dialogRef.current?.close();
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") stepCert(1);
              if (e.key === "ArrowLeft") stepCert(-1);
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-line/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-fg">{lightboxCert.title}</h3>
                <p className="text-xs text-muted">
                  {lightboxCert.institution} {lightboxCert.meta ? `· ${lightboxCert.meta}` : ""}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                className="rounded border border-line/30 px-3 py-1 font-mono text-xs hover:bg-surface-2"
                onClick={() => dialogRef.current?.close()}
              >
                {t.close}
              </button>
            </div>
            <div className="relative" dir="ltr">
              <img
                key={lightboxCert.id}
                src={lightboxCert.imgSrc}
                alt={lightboxCert.title}
                className="pop-in max-h-[70vh] max-w-full rounded border border-line/20 object-contain"
              />
              {imageCerts.length > 1 && (
                <>
                  <button type="button" className="lb-nav left-2" onClick={() => stepCert(-1)} aria-label={t.prevCert}>
                    ←
                  </button>
                  <button type="button" className="lb-nav right-2" onClick={() => stepCert(1)} aria-label={t.nextCert}>
                    →
                  </button>
                </>
              )}
            </div>
            {lightboxCert.pdfHref && (
              <div className="mt-3 flex w-full justify-end">
                <a
                  href={lightboxCert.pdfHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent underline"
                >
                  {t.openOriginal}
                </a>
              </div>
            )}
          </dialog>
        )}
      </div>
      {printMode && (
        <PrintToolbar
          t={t}
          lang={lang}
          onLang={changeLang}
          onExit={exitPrintMode}
          onPrint={() => window.print()}
          printRef={printBtnRef}
        />
      )}
      <PrintSheet t={t} L={L} />
      <LangToast
        target={printMode ? null : suggest}
        onAccept={() => suggest && changeLang(suggest)}
        onDismiss={dismissSuggest}
      />
    </>
  );
}
