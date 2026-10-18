/**
 * VoiceReader v7 - Motor de Leitura de Voz Inteligente (Acre-Acessível)
 * Adaptado para arquiteturas SPA e jornais editoriais (zero hardcode).
 */

import { TextNormalizer } from './text-normalizer';

export interface VoiceReaderCallbacks {
  onStart?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onSentenceChange?: (element: HTMLElement | null, text: string) => void;
}

export interface ReaderStructureConfig {
  /** URL opcional de servidor TTS neural externo (se omitido, usa Web Speech API nativa) */
  backendUrl?: string;
  /** Seletores CSS de raízes de conteúdo principal para leitura sequencial */
  contentRoots?: string[];
  /** Seletores CSS de blocos legíveis dentro das raízes */
  readableSelectors?: string[];
  /** Seletores CSS de elementos ou contêineres que nunca devem ser lidos */
  ignoreSelectors?: string[];
  /** Seletores CSS de elementos interativos cujo clique normal não deve ser interceptado */
  interactiveSelectors?: string[];
  /** Atributo HTML opcional com texto descritivo estruturado para leitura (ex: tirinhas) */
  readableTextAttr?: string;
  /** Atributo HTML para botões que disparam leitura direta ao clicar */
  directSpeakAttr?: string;
  /** Dicionário adicional de siglas para pronúncia */
  customAcronyms?: Record<string, string>;
}

const DEFAULT_STRUCTURE: Required<Omit<ReaderStructureConfig, 'backendUrl' | 'customAcronyms'>> = {
  contentRoots: ['[role="dialog"]', 'main', 'article', '[role="main"]'],
  readableSelectors: [
    '[data-readable-text]',
    'h1',
    'h2',
    'h3',
    'h4',
    'p',
    'blockquote',
    'figcaption',
    'li',
    'summary',
  ],
  ignoreSelectors: [
    'capi-mascot',
    'acre-accessibility-panel',
    'nav',
    'script',
    'style',
    'noscript',
    '[aria-hidden="true"]',
    '.sr-only',
    '[data-paywall-locked="true"]',
    '.select-none.pointer-events-none',
  ],
  interactiveSelectors: [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    'summary',
    '[role="button"]',
    '[data-lightbox-trigger]',
  ],
  readableTextAttr: 'data-readable-text',
  directSpeakAttr: 'data-acre-speak',
};

export class VoiceReader {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private normalizer: TextNormalizer;
  private callbacks: VoiceReaderCallbacks;
  private structure: Required<Omit<ReaderStructureConfig, 'backendUrl' | 'customAcronyms'>>;

  private isReading = false;
  private isPaused = false;
  private rate = 1.05;
  private pitch = 1.0;

  private readableElements: HTMLElement[] = [];
  private currentIndex = 0;
  private currentHighlightedEl: HTMLElement | null = null;

  private readOnHover = false;
  private hoverTimeout: number | null = null;
  private lastHoveredEl: HTMLElement | null = null;

  private serverTtsUrl = '';
  private currentAudio: HTMLAudioElement | null = null;
  private useServerTts = false;

  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private watchdogTimer: number | null = null;

  private subChunks: string[] = [];
  private currentSubChunkIndex = 0;
  private activeSessionId = 0;

  private isProgrammaticScroll = false;
  private lastUserMouseMoveTime = 0;
  private consecutiveErrors = 0;
  private consecutiveInstantSkips = 0;

  constructor(callbacks: VoiceReaderCallbacks = {}, config: ReaderStructureConfig = {}) {
    this.callbacks = callbacks;
    this.structure = {
      contentRoots: config.contentRoots?.length ? config.contentRoots : DEFAULT_STRUCTURE.contentRoots,
      readableSelectors: config.readableSelectors?.length
        ? config.readableSelectors
        : DEFAULT_STRUCTURE.readableSelectors,
      ignoreSelectors: config.ignoreSelectors?.length
        ? config.ignoreSelectors
        : DEFAULT_STRUCTURE.ignoreSelectors,
      interactiveSelectors: config.interactiveSelectors?.length
        ? config.interactiveSelectors
        : DEFAULT_STRUCTURE.interactiveSelectors,
      readableTextAttr: config.readableTextAttr || DEFAULT_STRUCTURE.readableTextAttr,
      directSpeakAttr: config.directSpeakAttr || DEFAULT_STRUCTURE.directSpeakAttr,
    };
    this.normalizer = new TextNormalizer({
      customAcronyms: config.customAcronyms,
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      this.setupHoverReading();
      this.setupClickToRead();
    }

    if (config.backendUrl) {
      this.serverTtsUrl = `${config.backendUrl.replace(/\/$/, '')}/api/tts`;
      this.useServerTts = true;
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      if (!this.synth) return;
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0 && !this.selectedVoice) {
        this.selectedVoice = this.pickBestPortugueseVoice(this.voices);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  private pickBestPortugueseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const ptVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().includes('pt-br') ||
        v.lang.toLowerCase().includes('pt_br') ||
        v.lang.toLowerCase().startsWith('pt'),
    );

    if (ptVoices.length === 0) {
      return voices[0] || null;
    }

    const priorityKeywords = [
      'natural',
      'francisca',
      'antonio',
      'thalita',
      'neural',
      'online',
      'google português do brasil',
      'google',
      'luciana',
      'daniel',
      'microsoft',
      'premium',
      'enhanced',
      'brasil',
      'brazil',
    ];

    let bestVoice = ptVoices[0];
    let bestScore = -1;

    for (const v of ptVoices) {
      let score = 0;
      const nameLower = v.name.toLowerCase();
      const langLower = v.lang.toLowerCase();

      if (langLower.includes('br')) score += 20;

      for (let i = 0; i < priorityKeywords.length; i++) {
        if (nameLower.includes(priorityKeywords[i])) {
          score += (priorityKeywords.length - i) * 5;
        }
      }

      if (!v.localService) score += 10;

      if (score > bestScore) {
        bestScore = score;
        bestVoice = v;
      }
    }

    return bestVoice;
  }

  public getAvailablePortugueseVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter((v) => v.lang.toLowerCase().startsWith('pt'));
  }

  public setVoiceByName(name: string) {
    const found = this.voices.find((v) => v.name === name);
    if (found) {
      this.selectedVoice = found;
      this.useServerTts = false;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.2, rate));
    if (this.currentAudio) {
      this.currentAudio.playbackRate = this.rate;
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public setReadOnHover(enabled: boolean) {
    this.readOnHover = enabled;
    if (!enabled) {
      this.clearHighlight();
    }
  }

  public isReadOnHoverEnabled(): boolean {
    return this.readOnHover;
  }

  /** Chamado em mudanças de rota SPA para parar leitura anterior e reindexar o DOM */
  public onRouteChange() {
    if (this.isReading || this.isPaused) {
      this.stop();
    } else {
      this.clearHighlight();
    }
    this.readableElements = [];
    this.currentIndex = 0;
  }

  private isIgnoredElement(el: HTMLElement | null): boolean {
    if (!el) return true;
    const ignoreQuery = this.structure.ignoreSelectors.join(', ');
    if (!ignoreQuery) return false;
    try {
      return Boolean(el.matches(ignoreQuery) || el.closest(ignoreQuery));
    } catch {
      return false;
    }
  }

  private resolveRootContainers(): ParentNode[] {
    if (typeof document === 'undefined') return [];
    for (const rootSel of this.structure.contentRoots) {
      try {
        const matches = Array.from(document.querySelectorAll<HTMLElement>(rootSel)).filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        if (matches.length > 0) return matches;
      } catch {
        /* ignore invalid selector */
      }
    }
    return [document.body];
  }

  public scanReadableElements(): HTMLElement[] {
    if (typeof document === 'undefined') return [];
    const selector = this.structure.readableSelectors.join(', ');
    const roots = this.resolveRootContainers();
    const candidates: HTMLElement[] = [];

    for (const root of roots) {
      const nodeList = root.querySelectorAll<HTMLElement>(selector);
      nodeList.forEach((el) => {
        if (!candidates.includes(el)) {
          candidates.push(el);
        }
      });
    }

    const filtered = candidates.filter((el) => {
      if (this.isIgnoredElement(el)) return false;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      const text = this.extractCleanText(el);
      return text.length > 2;
    });

    // Evita ler o elemento pai E o elemento filho duplicadamente quando ambos batem no seletor
    const deduplicated = filtered.filter((el) => {
      const attrText = el.getAttribute(this.structure.readableTextAttr);
      if (attrText) return true;
      const parentWithAttr = el.parentElement?.closest(`[${this.structure.readableTextAttr}]`);
      if (parentWithAttr && filtered.includes(parentWithAttr as HTMLElement)) {
        return false;
      }
      const hasFilteredChild = filtered.some((other) => other !== el && el.contains(other));
      return !hasFilteredChild;
    });

    this.readableElements = deduplicated;
    return deduplicated;
  }

  private extractCleanText(el: HTMLElement): string {
    const customReadable = el.getAttribute(this.structure.readableTextAttr);
    if (customReadable && customReadable.trim().length > 0) {
      return customReadable.trim();
    }

    const clone = el.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll('[aria-hidden="true"], .sr-only, script, style, svg')
      .forEach((n) => n.remove());

    return (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  private splitIntoSentences(text: string): string[] {
    const normalized = this.normalizer.normalize(text);
    if (normalized.length <= 180) {
      return [normalized];
    }

    const rawParts = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];
    const chunks: string[] = [];
    let current = '';

    for (const part of rawParts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if ((current + ' ' + trimmed).trim().length <= 200) {
        current = (current + ' ' + trimmed).trim();
      } else {
        if (current) chunks.push(current);
        if (trimmed.length > 220) {
          const subParts = trimmed.split(/,\s*/);
          let subCurrent = '';
          for (const sp of subParts) {
            if ((subCurrent + ', ' + sp).length <= 200) {
              subCurrent = subCurrent ? `${subCurrent}, ${sp}` : sp;
            } else {
              if (subCurrent) chunks.push(subCurrent);
              subCurrent = sp;
            }
          }
          current = subCurrent;
        } else {
          current = trimmed;
        }
      }
    }
    if (current) chunks.push(current);

    return chunks.length > 0 ? chunks : [normalized];
  }

  public startPageReading(fromBeginning = true) {
    if (!this.synth && !this.useServerTts) return;

    this.cancelCurrentSpeechOnly();
    this.consecutiveErrors = 0;

    if (fromBeginning || this.readableElements.length === 0) {
      this.scanReadableElements();
      this.currentIndex = 0;
    }

    if (this.readableElements.length === 0) {
      this.speakDirectText('Não encontramos textos legíveis nesta seção.');
      return;
    }

    this.isReading = true;
    this.isPaused = false;
    this.activeSessionId++;
    this.callbacks.onStart?.();
    this.readCurrentElement(this.activeSessionId);
  }

  private readCurrentElement(sessionId: number) {
    if (!this.isReading || sessionId !== this.activeSessionId) return;

    if (this.currentIndex >= this.readableElements.length) {
      this.stop();
      return;
    }

    const el = this.readableElements[this.currentIndex];
    const rawText = this.extractCleanText(el);

    if (!rawText) {
      this.currentIndex++;
      this.readCurrentElement(sessionId);
      return;
    }

    this.highlightElement(el, true);
    this.callbacks.onSentenceChange?.(el, rawText);

    this.subChunks = this.splitIntoSentences(rawText);
    this.currentSubChunkIndex = 0;

    this.speakNextSubChunk(sessionId);
  }

  private speakNextSubChunk(sessionId: number) {
    if (!this.isReading || sessionId !== this.activeSessionId) return;

    if (this.currentSubChunkIndex >= this.subChunks.length) {
      this.currentIndex++;
      window.setTimeout(() => {
        if (this.isReading && !this.isPaused && sessionId === this.activeSessionId) {
          this.readCurrentElement(sessionId);
        }
      }, 350);
      return;
    }

    const chunkText = this.subChunks[this.currentSubChunkIndex];
    this.speakRawChunk(chunkText, sessionId, () => {
      if (this.isReading && !this.isPaused && sessionId === this.activeSessionId) {
        this.currentSubChunkIndex++;
        this.speakNextSubChunk(sessionId);
      }
    });
  }

  public readSingleElement(el: HTMLElement) {
    const rawText = this.extractCleanText(el);
    if (!rawText) return;

    this.cancelCurrentSpeechOnly();
    this.isReading = true;
    this.isPaused = false;
    this.activeSessionId++;
    const sessionId = this.activeSessionId;

    this.highlightElement(el, false);
    this.callbacks.onStart?.();
    this.callbacks.onSentenceChange?.(el, rawText);

    this.subChunks = this.splitIntoSentences(rawText);
    this.currentSubChunkIndex = 0;

    const playSingleChunks = () => {
      if (!this.isReading || sessionId !== this.activeSessionId) return;
      if (this.currentSubChunkIndex >= this.subChunks.length) {
        this.isReading = false;
        this.clearHighlight();
        this.callbacks.onStop?.();
        return;
      }

      const chunk = this.subChunks[this.currentSubChunkIndex];
      this.speakRawChunk(chunk, sessionId, () => {
        if (this.isReading && !this.isPaused && sessionId === this.activeSessionId) {
          this.currentSubChunkIndex++;
          playSingleChunks();
        }
      });
    };

    playSingleChunks();
  }

  public speakDirectText(rawText: string) {
    this.cancelCurrentSpeechOnly();
    this.isReading = true;
    this.isPaused = false;
    this.activeSessionId++;
    const sessionId = this.activeSessionId;

    this.callbacks.onStart?.();
    this.callbacks.onSentenceChange?.(null, rawText);

    this.subChunks = this.splitIntoSentences(rawText);
    this.currentSubChunkIndex = 0;

    const playChunks = () => {
      if (!this.isReading || sessionId !== this.activeSessionId) return;
      if (this.currentSubChunkIndex >= this.subChunks.length) {
        this.isReading = false;
        this.callbacks.onStop?.();
        return;
      }

      const chunk = this.subChunks[this.currentSubChunkIndex];
      this.speakRawChunk(chunk, sessionId, () => {
        if (this.isReading && !this.isPaused && sessionId === this.activeSessionId) {
          this.currentSubChunkIndex++;
          playChunks();
        }
      });
    };

    playChunks();
  }

  private speakRawChunk(normalizedChunk: string, sessionId: number, onComplete: () => void) {
    this.clearWatchdog();

    if (this.useServerTts && this.serverTtsUrl) {
      this.fetchAndPlayServerAudio(normalizedChunk, sessionId, onComplete);
      return;
    }

    if (!this.synth) {
      onComplete();
      return;
    }

    const cleanText = normalizedChunk.trim();
    if (!cleanText || cleanText.length < 2) {
      onComplete();
      return;
    }

    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0 && !this.selectedVoice) {
        this.selectedVoice = this.pickBestPortugueseVoice(this.voices);
      }
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.selectedVoice?.lang || 'pt-BR';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.currentUtterance = utterance;
    (window as unknown as Record<string, unknown>).__acreActiveUtterance = utterance;

    let completed = false;
    const speechStartTime = Date.now();

    const finishOnce = () => {
      if (completed) return;
      completed = true;
      this.clearWatchdog();
      if (sessionId === this.activeSessionId) {
        onComplete();
      }
    };

    utterance.onstart = () => {
      this.consecutiveErrors = 0;
    };

    utterance.onend = () => {
      const elapsed = Date.now() - speechStartTime;
      // Se um texto significativo (>= 12 caracteres) disparar onend em menos de 200ms,
      // a síntese não produziu áudio real (falha silenciosa da API no navegador).
      if (cleanText.length >= 12 && elapsed < 200) {
        this.consecutiveInstantSkips++;
        if (this.consecutiveInstantSkips >= 3) {
          console.warn('[VoiceReader] Síntese de voz finalizou instantaneamente repetidas vezes. Encerrando leitura para evitar pulos.');
          this.stop();
          return;
        }
      } else {
        this.consecutiveInstantSkips = 0;
      }

      this.consecutiveErrors = 0;
      finishOnce();
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') {
        this.clearWatchdog();
        return;
      }

      console.warn(`[VoiceReader] Erro na síntese Web Speech (${e.error}).`);

      const recoverableErrors = ['synthesis-failed', 'language-unavailable', 'network', 'audio-busy', 'voice-unavailable'];
      const isRecoverable = !e.error || recoverableErrors.includes(e.error);

      // Fallback automático para o backend TTS caso disponível
      if (isRecoverable && this.serverTtsUrl) {
        console.warn('🦫 Chaveando para servidor TTS neural após falha no Web Speech local.');
        this.useServerTts = true;
        this.clearWatchdog();
        this.fetchAndPlayServerAudio(cleanText, sessionId, onComplete);
        return;
      }

      this.consecutiveErrors++;
      if (this.consecutiveErrors >= 2) {
        console.warn('[VoiceReader] Síntese de voz bloqueada ou sem suporte no sistema operacional. Encerrando leitura.');
        this.callbacks.onSentenceChange?.(null, 'Síntese de voz indisponível ou sem suporte neste navegador.');
        this.stop();
        return;
      }
      // Tenta resetar a voz para padrão do sistema caso a selecionada tenha falhado
      this.selectedVoice = null;
      window.setTimeout(() => finishOnce(), 400);
    };

    const estimatedMs = Math.max(5000, (cleanText.length * 110) / this.rate + 3000);
    this.watchdogTimer = window.setTimeout(() => {
      if (!completed && this.isReading && !this.isPaused && sessionId === this.activeSessionId) {
        finishOnce();
      }
    }, estimatedMs);

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utterance);
    } catch {
      this.consecutiveErrors++;
      if (this.consecutiveErrors >= 3) {
        this.stop();
      } else {
        window.setTimeout(() => finishOnce(), 400);
      }
    }
  }

  private clearWatchdog() {
    if (this.watchdogTimer !== null) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  private async fetchAndPlayServerAudio(text: string, sessionId: number, onComplete: () => void) {
    try {
      const response = await fetch(this.serverTtsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (sessionId !== this.activeSessionId || !this.isReading) return;

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(audioUrl);
      audio.playbackRate = this.rate;
      this.currentAudio = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (sessionId === this.activeSessionId) {
          onComplete();
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        console.warn('[VoiceReader] Erro ao reproduzir áudio do servidor TTS.');
        this.callbacks.onSentenceChange?.(null, 'Erro ao reproduzir áudio do servidor de voz.');
        this.stop();
      };

      await audio.play();
    } catch (err) {
      console.warn('[VoiceReader] Falha na requisição ao servidor TTS:', err);
      this.callbacks.onSentenceChange?.(null, 'Servidor de voz offline ou indisponível.');
      this.stop();
    }
  }

  private cancelCurrentSpeechOnly() {
    this.clearWatchdog();
    this.currentUtterance = null;
    delete (window as unknown as Record<string, unknown>).__acreActiveUtterance;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        /* ignore */
      }
    }
  }

  public pause() {
    if (!this.isReading || this.isPaused) return;
    this.isPaused = true;
    this.clearWatchdog();

    if (this.currentAudio) {
      this.currentAudio.pause();
    } else if (this.synth) {
      try {
        this.synth.pause();
      } catch {
        /* ignore */
      }
    }
    this.callbacks.onPause?.();
  }

  public resume() {
    if (!this.isReading || !this.isPaused) return;
    this.isPaused = false;

    if (this.currentAudio) {
      this.currentAudio.play();
    } else if (this.synth) {
      try {
        this.synth.resume();
      } catch {
        /* ignore */
      }
    }
    this.callbacks.onResume?.();
  }

  public stop() {
    this.activeSessionId++;
    this.isReading = false;
    this.isPaused = false;
    this.subChunks = [];
    this.currentSubChunkIndex = 0;
    this.currentIndex = 0;
    this.consecutiveErrors = 0;
    this.cancelCurrentSpeechOnly();
    this.clearHighlight();
    this.callbacks.onStop?.();
  }

  public nextElement() {
    if (this.readableElements.length === 0) {
      this.scanReadableElements();
    }
    if (this.currentIndex < this.readableElements.length - 1) {
      this.cancelCurrentSpeechOnly();
      this.currentIndex++;
      this.isReading = true;
      this.isPaused = false;
      this.activeSessionId++;
      this.callbacks.onStart?.();
      this.readCurrentElement(this.activeSessionId);
    }
  }

  public previousElement() {
    if (this.readableElements.length === 0) {
      this.scanReadableElements();
    }
    if (this.currentIndex > 0) {
      this.cancelCurrentSpeechOnly();
      this.currentIndex--;
      this.isReading = true;
      this.isPaused = false;
      this.activeSessionId++;
      this.callbacks.onStart?.();
      this.readCurrentElement(this.activeSessionId);
    }
  }

  public getStatus() {
    return {
      isReading: this.isReading,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      totalElements: this.readableElements.length,
    };
  }

  private highlightElement(el: HTMLElement, allowScroll = false) {
    this.clearHighlight();
    this.currentHighlightedEl = el;
    el.classList.add('acre-acessivel-reading-highlight');

    if (!allowScroll) return;

    const rect = el.getBoundingClientRect();
    const vHeight = window.innerHeight || document.documentElement.clientHeight;
    // Se o elemento já está razoavelmente visível na tela, NÃO mexe na rolagem da página
    const isInViewport = rect.top >= 60 && rect.bottom <= vHeight - 60;

    if (!isInViewport) {
      this.isProgrammaticScroll = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      window.setTimeout(() => {
        this.isProgrammaticScroll = false;
      }, 500);
    }
  }

  private clearHighlight() {
    if (this.currentHighlightedEl) {
      this.currentHighlightedEl.classList.remove('acre-acessivel-reading-highlight');
      this.currentHighlightedEl = null;
    }
  }

  private setupHoverReading() {
    if (typeof document === 'undefined') return;

    document.addEventListener(
      'mousemove',
      () => {
        this.lastUserMouseMoveTime = Date.now();
      },
      { passive: true },
    );

    const targetQuery = [
      ...this.structure.readableSelectors,
      'button',
      'a',
      'label',
    ].join(', ');

    document.addEventListener('mouseover', (e: MouseEvent) => {
      if (!this.readOnHover) return;
      if (this.isReading) return;
      if (this.isProgrammaticScroll) return;
      if (Date.now() - this.lastUserMouseMoveTime > 400) return;

      const target = e.target as HTMLElement | null;
      if (!target || this.isIgnoredElement(target)) return;

      const readableEl = target.closest(targetQuery) as HTMLElement | null;
      if (!readableEl || readableEl === this.lastHoveredEl || this.isIgnoredElement(readableEl)) {
        return;
      }

      if (this.hoverTimeout) {
        window.clearTimeout(this.hoverTimeout);
      }

      this.hoverTimeout = window.setTimeout(() => {
        if (!this.readOnHover || this.isReading || this.isProgrammaticScroll) return;
        const text = this.extractCleanText(readableEl);
        if (text && text.length > 1) {
          this.lastHoveredEl = readableEl;
          this.readSingleElement(readableEl);
        }
      }, 350);
    });
  }

  private setupClickToRead() {
    if (typeof document === 'undefined') return;
    const directAttr = this.structure.directSpeakAttr;
    const interactiveQuery = this.structure.interactiveSelectors.join(', ');
    const readableQuery = this.structure.readableSelectors.join(', ');

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Botão explícito [data-acre-speak="..."] sempre dispara a fala solicitada
      const directTrigger = target.closest(`[${directAttr}]`) as HTMLElement | null;
      if (directTrigger) {
        const textToSpeak = directTrigger.getAttribute(directAttr);
        if (textToSpeak && textToSpeak.trim()) {
          e.stopPropagation();
          this.speakDirectText(textToSpeak.trim());
          return;
        }
      }

      // 2. Quando "Apontar/Tocar para Ouvir" está ativo, tocar num bloco de texto lê o bloco
      if (!this.readOnHover) return;
      if (this.isIgnoredElement(target)) return;

      // Não bloqueia navegação se o usuário clicou num link ou botão interativo
      if (interactiveQuery && target.closest(interactiveQuery)) return;

      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;

      const bestTarget = target.closest(readableQuery) as HTMLElement | null;
      if (bestTarget && !this.isIgnoredElement(bestTarget)) {
        const text = this.extractCleanText(bestTarget);
        if (text && text.length > 2) {
          this.readSingleElement(bestTarget);
        }
      }
    });
  }
}
