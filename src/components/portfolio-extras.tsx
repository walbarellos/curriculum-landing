import type { CSSProperties, RefObject } from "react";
import { LANGS, SUGGEST, ui } from "@/lib/i18n";
import type { Lang, Localized, UI } from "@/lib/i18n";

/* ───────────── Seletor de idioma ─────────────
 * Cada opção é escrita no próprio idioma (Português · English · עברית), com `lang`
 * correto para leitores de tela. O seletor é sempre LTR: as opções não trocam de lugar
 * quando a página vira RTL, então o cursor "mora" no mesmo lugar.
 */
export function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const idx = Math.max(
    0,
    LANGS.findIndex((l) => l.id === lang)
  );
  return (
    <div className="lang-wrap">
      <span className="lang-label" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M2.5 12h19M12 2.5c2.8 2.9 4.2 6 4.2 9.5s-1.4 6.6-4.2 9.5c-2.8-2.9-4.2-6-4.2-9.5S9.2 5.4 12 2.5z" />
        </svg>
        <span className="lang-label-text">
          {ui[lang].langLabel}
        </span>
      </span>

      <div
        role="group"
        aria-label={ui[lang].langLabel}
        dir="ltr"
        className="lang-switch"
        style={{ ["--i" as string]: idx } as CSSProperties}
      >
        <span className="lang-thumb" aria-hidden="true" />
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            lang={l.html}
            dir={l.dir}
            className="lang-opt"
            aria-pressed={l.id === lang}
            onClick={() => onChange(l.id)}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Convite no idioma do visitante (não troca nada sozinho). */
export function LangToast({
  target,
  onAccept,
  onDismiss,
}: {
  target: "en" | "he" | null;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  if (!target) return null;
  const s = SUGGEST[target];
  const meta = LANGS.find((l) => l.id === target)!;
  return (
    <div className="lang-toast" role="status" lang={meta.html} dir={meta.dir}>
      <p className="lang-toast-text">{s.text}</p>
      <div className="lang-toast-actions">
        <button type="button" className="btn btn-primary !px-3 !py-1.5 !text-xs" onClick={onAccept}>
          {s.action}
        </button>
        <button type="button" className="btn btn-ghost !px-3 !py-1.5 !text-xs" onClick={onDismiss}>
          {s.dismiss}
        </button>
      </div>
    </div>
  );
}

/* ───────────── Barra do modo impressão (só na tela) ───────────── */
export function PrintToolbar({
  t,
  lang,
  onLang,
  onExit,
  onPrint,
  printRef,
}: {
  t: UI;
  lang: Lang;
  onLang: (l: Lang) => void;
  onExit: () => void;
  onPrint: () => void;
  printRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="print-toolbar" role="region" aria-label={t.printBadge}>
      <div className="print-toolbar-inner">
        <button type="button" className="pt-btn pt-ghost" onClick={onExit}>
          <span aria-hidden="true">✕</span> {t.printExit}
        </button>

        <p className="pt-info">
          <strong>{t.printBadge}</strong>
          <span>{t.printHint}</span>
        </p>

        <LangSwitch lang={lang} onChange={onLang} />

        <button ref={printRef} type="button" className="pt-btn pt-primary" onClick={onPrint}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9V3h12v6M6 18H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2" />
            <rect x="6" y="14" width="12" height="7" />
          </svg>
          {t.printNow}
        </button>
      </div>
    </div>
  );
}

/* ───────────── Currículo A4 (some na tela; aparece no modo impressão e no Ctrl+P) ─────────────
 * Documento próprio, em HTML semântico e sem efeitos: nada some por estar "recolhido"
 * na página (todos os projetos e certificados saem no papel). Usa os mesmos dados e
 * o mesmo idioma da página.
 */
const shortUrl = (href: string) => href.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function PrintSheet({ t, L }: { t: UI; L: Localized }) {
  const { bioInfo, projects, timeline, stackGroups, certificates } = L;
  const links = bioInfo.links;
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <article className="print-doc">
      <header className="pd-head">
        <h1>{bioInfo.name}</h1>
        <p className="pd-role">{bioInfo.role}</p>
        <ul className="pd-contact">
          <li dir="ltr">{links.email}</li>
          <li>{bioInfo.badges[0]}</li>
          <li dir="ltr">{shortUrl(links.github)}</li>
          <li dir="ltr">{shortUrl(links.linkedin)}</li>
          <li dir="ltr">{shortUrl(links.lattes)}</li>
        </ul>
      </header>

      <section>
        <h2>{t.pSummary}</h2>
        <p>{bioInfo.summary}</p>
        <p className="pd-meta">
          {bioInfo.availability} · {bioInfo.responseTime}
        </p>
      </section>

      <section>
        <h2>{t.pHistory}</h2>
        <ol className="pd-timeline">
          {timeline.map((item, i) => (
            <li key={i}>
              <span className="pd-date">{item.date}</span>
              <div>
                <strong>{item.title}</strong>
                <em>{item.sub}</em>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>{t.pSystems}</h2>
        <ul className="pd-projects">
          {featured.map((p) => (
            <li key={p.id}>
              <div className="pd-line">
                <strong>{p.name}</strong>
                <span className="pd-kind">{p.kind}</span>
              </div>
              <p>{p.summary}</p>
              <p className="pd-meta" dir="ltr">
                {p.stack.join(" · ")}
                {p.href ? ` — ${shortUrl(p.href)}` : ""}
              </p>
            </li>
          ))}
        </ul>

        {others.length > 0 && (
          <>
            <h3>{t.others}</h3>
            <ul className="pd-others">
              {others.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {p.summary}{" "}
                  <span className="pd-meta" dir="ltr">
                    ({p.stack.join(", ")}
                    {p.href ? `; ${shortUrl(p.href)}` : ""})
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2>{t.pStack}</h2>
        <dl className="pd-skills">
          {stackGroups.map((g) => (
            <div key={g.title}>
              <dt>{g.title}</dt>
              <dd>{g.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>{t.pCerts}</h2>
        <ul className="pd-certs">
          {certificates.map((c) => (
            <li key={c.id}>
              <strong>{c.title}</strong> — {c.institution} · {c.meta}
            </li>
          ))}
        </ul>
      </section>

      <footer className="pd-foot">
        <img src="/qr-curriculo.svg" alt={t.qrAltResume} width={72} height={72} />
        <div>
          <p>
            {t.pOnline}: <span dir="ltr">{shortUrl(links.publishedPage)}</span>
          </p>
          <p className="pd-meta">{t.updated}</p>
        </div>
      </footer>
    </article>
  );
}
