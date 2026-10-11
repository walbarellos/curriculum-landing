import { useCallback, useEffect, useRef, useState } from "react";

const W = 300;
const H = 400;
const LW = 75;
const LH = 100;
const STEP_DURATION = 2000;

export function HeroPortrait({ alt, className }: { alt: string; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cvGlyphsRef = useRef<HTMLCanvasElement>(null);
  const cvWavesRef = useRef<HTMLCanvasElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const lumMapRef = useRef<Float32Array | null>(null);
  const mouseRef = useRef({ x: -999, y: -999, in: false });
  const timeRef = useRef(0);
  const stepStartTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getL = useCallback((x: number, y: number): number => {
    const lum = lumMapRef.current;
    if (!lum) return 0.5;
    const lx = Math.min(LW - 1, Math.max(0, ((x / W) * LW) | 0));
    const ly = Math.min(LH - 1, Math.max(0, ((y / H) * LH) | 0));
    return lum[ly * LW + lx];
  }, []);

  // Renderização de Glifos (Canvas 2)
  const drawGlyphs = useCallback(() => {
    const cv = cvGlyphsRef.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const ink = rootStyle.getPropertyValue("--color-fg").trim() || "#18191a";
    const bg = rootStyle.getPropertyValue("--color-bg").trim() || "#f6f4ef";
    const uru = rootStyle.getPropertyValue("--color-accent").trim() || "#b8381b";

    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.textAlign = "center";
    g.textBaseline = "middle";

    const s = 7;
    const R = " .:-=+*#%@";
    const m = mouseRef.current;
    const t = timeRef.current;

    for (let y = s / 2; y < H; y += s) {
      for (let x = s / 2; x < W; x += s) {
        const l = getL(x, y);
        const dist = Math.hypot(x - m.x, y - m.y);
        const n = m.in ? Math.max(0, 1 - dist / 80) : 0;
        const k = Math.min(9, Math.max(0, ((1 - l) * 9 + n * 3) | 0));
        if (!k) continue;

        g.fillStyle = n > 0.05 ? uru : ink;
        g.font = `700 ${s + n * 6}px ui-monospace, monospace`;
        g.fillText(
          n > 0.05 ? (((x * 7 + y * 13 + t / 110) | 0) % 2 ? "1" : "0") : R[k],
          x,
          y
        );
      }
    }
  }, [getL]);

  // Renderização de Linhas em Relevo (Canvas 3)
  const drawWaves = useCallback(() => {
    const cv = cvWavesRef.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const ink = rootStyle.getPropertyValue("--color-fg").trim() || "#18191a";
    const bg = rootStyle.getPropertyValue("--color-bg").trim() || "#f6f4ef";
    const ocre = "#d49424";

    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.lineWidth = 1.25;
    g.lineJoin = "round";

    const rows = 56;
    const cols = 110;
    const m = mouseRef.current;
    const t = timeRef.current;

    for (let r = 0; r < rows; r++) {
      const y0 = 24 + (r * (H - 36)) / (rows - 1);
      g.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * W;
        const dk = 1 - getL(x, y0);
        const dist = Math.hypot(x - m.x, y0 - m.y);
        const w = m.in ? Math.sin(dist / 10 - t / 180) * Math.max(0, 1 - dist / 110) * 5 : 0;
        const y = y0 - Math.pow(dk, 1.3) * 24 + w;
        if (c === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokeStyle = m.in && Math.abs(y0 - m.y) < 14 ? ocre : ink;
      g.stroke();
      g.lineTo(W, H);
      g.lineTo(0, H);
      g.closePath();
      g.fillStyle = bg;
      g.fill();
    }
  }, [getL]);

  // 1. Processamento da luminância da imagem para os efeitos em Canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const oc = document.createElement("canvas");
      oc.width = LW;
      oc.height = LH;
      const ox = oc.getContext("2d");
      if (!ox) return;
      ox.drawImage(img, 0, 0, LW, LH);
      const id = ox.getImageData(0, 0, LW, LH).data;
      const lum = new Float32Array(LW * LH);
      for (let i = 0; i < LW * LH; i++) {
        const r = id[i * 4];
        const g = id[i * 4 + 1];
        const b = id[i * 4 + 2];
        const val = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        lum[i] = Math.min(1, Math.max(0, (val - 0.12) / 0.68));
      }
      lumMapRef.current = lum;
      drawGlyphs();
      drawWaves();
    };
    img.src = "/img/perfil.jpg";
  }, [drawGlyphs, drawWaves]);

  // Inicialização da resolução dos canvases
  useEffect(() => {
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    if (cvGlyphsRef.current) {
      cvGlyphsRef.current.width = W * dpr;
      cvGlyphsRef.current.height = H * dpr;
      const g = cvGlyphsRef.current.getContext("2d");
      g?.scale(dpr, dpr);
    }
    if (cvWavesRef.current) {
      cvWavesRef.current.width = W * dpr;
      cvWavesRef.current.height = H * dpr;
      const g = cvWavesRef.current.getContext("2d");
      g?.scale(dpr, dpr);
    }
  }, []);

  // 4. Sequenciador Interativo (Troca a cada 2s enquanto o mouse estiver sobre o palco)
  useEffect(() => {
    let active = true;

    function loop(now: number) {
      if (!active) return;
      timeRef.current = now;

      if (isHovering && activeStep !== null) {
        if (activeStep === 1) drawGlyphs();
        if (activeStep === 2) drawWaves();

        const elapsed = now - stepStartTimeRef.current;
        const progress = Math.min(100, (elapsed / STEP_DURATION) * 100);

        if (fillRefs.current[activeStep]) {
          fillRefs.current[activeStep]!.style.width = `${progress}%`;
        }

        if (elapsed >= STEP_DURATION) {
          stepStartTimeRef.current = now;
          const nextStep = (activeStep + 1) % 4;
          fillRefs.current.forEach((fill, idx) => {
            if (!fill) return;
            if (idx < nextStep) fill.style.width = "100%";
            else fill.style.width = "0%";
          });
          setActiveStep(nextStep);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    }

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovering, activeStep, drawGlyphs, drawWaves]);

  // Handlers do mouse e toque (Android / mobile)
  const updateCoordsFromClient = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clampedX = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const clampedY = Math.min(rect.height, Math.max(0, clientY - rect.top));
    mouseRef.current.x = (clampedX * W) / rect.width;
    mouseRef.current.y = (clampedY * H) / rect.height;
    mouseRef.current.in = true;

    const mx = (((clampedX / rect.width) * 2 - 1)).toFixed(2);
    const my = (((clampedY / rect.height) * 2 - 1)).toFixed(2);
    el.style.setProperty("--mx", mx);
    el.style.setProperty("--my", my);
  };

  const handlePointerEnter = () => {
    setIsHovering(true);
    setActiveStep(0); // Troca imediatamente para o primeiro efeito da sequência (Kene Cultural)
    stepStartTimeRef.current = performance.now();
    fillRefs.current.forEach((fill) => {
      if (fill) fill.style.width = "0%";
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovering(true);
    updateCoordsFromClient(e.clientX, e.clientY);
    if (activeStep === null) {
      setActiveStep(0);
      stepStartTimeRef.current = performance.now();
      fillRefs.current.forEach((fill) => {
        if (fill) fill.style.width = "0%";
      });
    } else {
      // No toque sequencial com dedo no celular, avanca para o proximo efeito
      const nextStep = (activeStep + 1) % 4;
      handleStepClick(nextStep);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateCoordsFromClient(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setActiveStep(null); // Volta a foto normal natural
    mouseRef.current.in = false;
    const el = stageRef.current;
    if (el) {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    }
    fillRefs.current.forEach((fill) => {
      if (fill) fill.style.width = "0%";
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateCoordsFromClient(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleStepClick = (stepIdx: number) => {
    setIsHovering(true);
    setActiveStep(stepIdx);
    stepStartTimeRef.current = performance.now();
    fillRefs.current.forEach((fill, idx) => {
      if (!fill) return;
      if (idx < stepIdx) fill.style.width = "100%";
      else fill.style.width = "0%";
    });
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      className="hero-seq-wrapper flex flex-col items-center select-none"
    >
      <div
        ref={stageRef}
        className={`hero-seq-stage relative overflow-hidden cursor-crosshair border border-line/20 hover:border-line transition-[border-color,box-shadow] duration-300 bg-[var(--color-bg)] touch-manipulation ${className ?? ""}`}
        style={{
          aspectRatio: "3 / 4",
          borderRadius: "999px 999px 6px 6px",
        }}
        role="img"
        aria-label={alt}
      >
      {/* ══════════════ ESTADO DE REPOUSO: FOTO NORMAL NATURAL ══════════════ */}
      <div
        className={`hero-seq-layer hero-layer-normal absolute inset-0 transition-opacity duration-400 ease-out ${
          activeStep === null ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <img
          src="/img/perfil.jpg"
          alt={alt}
          width={288}
          height={352}
          className="h-full w-full object-cover object-top filter contrast-[1.05] saturate-[1.02]"
          style={{ borderRadius: "999px 999px 0 0" }}
        />
      </div>

      {/* ══════════════ QUADRO 1: KENÊ CULTURAL & PLANOS DO ACRE ══════════════ */}
      <div
        className={`hero-seq-layer hero-layer-kene absolute inset-0 overflow-hidden bg-[var(--color-bg)] transition-opacity duration-400 ease-out ${
          activeStep === 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Planos Geométricos com grafismo Kenê */}
        <div
          className="absolute rounded-full shadow-inner overflow-hidden"
          style={{
            width: "82%",
            aspectRatio: "1",
            backgroundColor: "#b8381b",
            right: "-16%",
            top: "2%",
            transform: "translate(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 12px))",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            className="absolute inset-[-20px] opacity-90"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0 L48 24 L24 48 L0 24 Z' fill='none' stroke='%23e6b55c' stroke-width='2' stroke-opacity='0.45'/%3E%3Cpath d='M24 8 L40 24 L24 40 L8 24 Z' fill='none' stroke='%23e6b55c' stroke-width='1.5' stroke-opacity='0.45'/%3E%3Cpath d='M24 16 L32 24 L24 32 L16 24 Z' fill='%23e6b55c' fill-opacity='0.45'/%3E%3Cpath d='M0 0 L10 10 M48 0 L38 10 M48 48 L38 38 M0 48 L10 38' stroke='%23e6b55c' stroke-width='2' stroke-opacity='0.45'/%3E%3C/svg%3E\")",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        {/* Pilar Jenipapo */}
        <div
          className="absolute left-0 top-[14%] bottom-0 overflow-hidden"
          style={{
            width: "24%",
            backgroundColor: "#161c1a",
            transform: "translateX(calc(var(--mx, 0) * -8px))",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16 L16 0 L32 16 L16 32 Z' fill='none' stroke='%23d49424' stroke-width='1.5' stroke-opacity='0.35'/%3E%3C/svg%3E\")",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Quarto de círculo Ocre */}
        <div
          className="absolute left-[8%] bottom-[4%]"
          style={{
            width: "38%",
            aspectRatio: "1",
            borderRadius: "100% 0 0 0",
            backgroundColor: "#d49424",
            transform: "translate(calc(var(--mx, 0) * -16px), calc(var(--my, 0) * -10px))",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Foto em arco com mix-blend multiply (elimina fundo cinza) */}
        <img
          src="/img/perfil.jpg"
          alt=""
          width={288}
          height={352}
          className="hero-kene-photo absolute left-[14%] bottom-0 w-[78%] h-[90%] object-cover object-top filter grayscale contrast-[1.22] pointer-events-none"
          style={{
            borderRadius: "999px 999px 0 0",
            transform: "translate(calc(var(--mx, 0) * 4px), calc(var(--my, 0) * 4px))",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* ══════════════ QUADRO 2: GLIFOS DE CÓDIGO (GLYPHWAVE) ══════════════ */}
      <div
        className={`hero-seq-layer hero-layer-canvas absolute inset-0 transition-opacity duration-400 ease-out ${
          activeStep === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <canvas ref={cvGlyphsRef} className="h-full w-full block" />
      </div>

      {/* ══════════════ QUADRO 3: LINHAS EM RELEVO (FOURIER / ONDAS) ══════════════ */}
      <div
        className={`hero-seq-layer hero-layer-canvas absolute inset-0 transition-opacity duration-400 ease-out ${
          activeStep === 2 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <canvas ref={cvWavesRef} className="h-full w-full block" />
      </div>

      {/* ══════════════ QUADRO 4: COLAGEM DUOTONE COM PIGMENTOS & KENÊ ══════════════ */}
      <div
        className={`hero-seq-layer hero-layer-collage absolute inset-0 overflow-hidden transition-opacity duration-400 ease-out ${
          activeStep === 3 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <img
          src="/img/perfil.jpg"
          alt=""
          width={288}
          height={352}
          className="absolute left-[6%] top-[6%] w-[88%] h-[90%] object-cover object-top"
          style={{ filter: "url(#heroDuoJeni)" }}
        />
        <img
          src="/img/perfil.jpg"
          alt=""
          width={288}
          height={352}
          className="hero-collage-multiply absolute left-[6%] top-[6%] w-[88%] h-[90%] object-cover object-top"
          style={{
            filter: "url(#heroDuoUru)",
            transform: "translate(calc(5px + var(--mx, 0) * 10px), calc(4px + var(--my, 0) * 8px))",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 mix-blend-multiply" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>
        <div
          className="absolute bottom-[4%] inset-x-[4%] h-[36px] opacity-85 border border-[#e6b55c] pointer-events-none"
          style={{
            backgroundColor: "#161c1a",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 18 L9 9 L18 18 L27 9 L36 18 L27 27 L18 18 L9 27 Z' fill='none' stroke='%23e6b55c' stroke-width='1.8' stroke-opacity='0.7'/%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
            mixBlendMode: "multiply",
            transform: "rotate(-1.5deg)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Filtros SVG para o duotone e textura da colagem */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="heroDuoJeni" colorInterpolationFilters="sRGB">
            <feColorMatrix values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues=".086 .965" />
              <feFuncG type="table" tableValues=".110 .957" />
              <feFuncB type="table" tableValues=".102 .937" />
            </feComponentTransfer>
          </filter>
          <filter id="heroDuoUru" colorInterpolationFilters="sRGB">
            <feColorMatrix values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues=".722 .965" />
              <feFuncG type="table" tableValues=".220 .957" />
              <feFuncB type="table" tableValues=".106 .937" />
            </feComponentTransfer>
          </filter>
          <filter id="heroGrain">
            <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0" />
          </filter>
        </defs>
      </svg>
      </div>

      {/* Barra transparente tipo story mostrando o tempo de cada quadro (2s) */}
      <div
        className="sequencer-bar flex items-center justify-center gap-1.5 w-48 sm:w-56 md:w-60 px-0.5 mt-2.5 transition-opacity duration-300"
        role="tablist"
        aria-label="Controle de estagios da sequencia estilo story"
      >
        {[0, 1, 2, 3].map((stepIdx) => (
          <button
            key={stepIdx}
            type="button"
            onClick={() => handleStepClick(stepIdx)}
            className="group relative flex-1 py-2 cursor-pointer focus:outline-none touch-manipulation"
            title={`Quadro ${stepIdx + 1} de 4 (2s)`}
            role="tab"
            aria-selected={activeStep === stepIdx}
          >
            <div className="relative w-full h-[3.5px] group-hover:h-[5px] group-active:h-[5px] rounded-full overflow-hidden bg-foreground/15 dark:bg-foreground/20 backdrop-blur-[2px] transition-[height] duration-150">
              <div
                ref={(el) => {
                  fillRefs.current[stepIdx] = el;
                }}
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent,#b8381b)]"
                style={{ width: "0%" }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
