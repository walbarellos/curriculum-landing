/**
 * AcreAccessibilityPanel - Painel Completo de Acessibilidade e Controle de Voz (Acre-Acessível)
 * Seguro para SSR: registra o Custom Element somente no navegador.
 */

import type { VoiceReader } from './voice-reader';

export interface AccessibilitySettings {
  fontScale: number;
  highContrast: boolean;
  darkMode: boolean;
  dyslexicFont: boolean;
  lineSpacing: boolean;
  highlightLinks: boolean;
  readingGuide: boolean;
  stopAnimations: boolean;
  speechRate: number;
  readOnHover: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1.0,
  highContrast: false,
  darkMode: false,
  dyslexicFont: false,
  lineSpacing: false,
  highlightLinks: false,
  readingGuide: false,
  stopAnimations: false,
  speechRate: 1.05,
  readOnHover: false,
};

const ICONS = {
  play: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  pause: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  prev: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  next: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  stop: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
  speaker: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  type: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  eye: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  touch: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>`,
  contrast: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z" fill="currentColor"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  dyslexic: `<span style="font-family:serif;font-weight:700;font-size:15px;letter-spacing:-0.5px;">Abc</span>`,
  spacing: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
  links: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  ruler: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  pauseMotion: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>`,
};

export interface AccessibilityPanelElement extends HTMLElement {
  setVoiceReader(reader: VoiceReader): void;
  toggle(force?: boolean): void;
  updateReadingStatus(isReading: boolean, isPaused: boolean, currentText?: string): void;
}

export function registerAccessibilityPanel(): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get('acre-accessibility-panel')) return;

  class AcreAccessibilityPanel extends HTMLElement implements AccessibilityPanelElement {
    private shadow: ShadowRoot;
    private isOpen = false;
    private settings: AccessibilitySettings = { ...DEFAULT_SETTINGS };
    private voiceReader: VoiceReader | null = null;
    private readingGuideEl: HTMLElement | null = null;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
      this.loadSettings();
    }

    public setVoiceReader(reader: VoiceReader) {
      this.voiceReader = reader;
      this.voiceReader.setRate(this.settings.speechRate);
      this.voiceReader.setReadOnHover(this.settings.readOnHover);
      this.populateVoices();
    }

    connectedCallback() {
      this.injectGlobalStyles();
      this.render();
      this.applySettingsToPage();
      this.setupGlobalListeners();
    }

    public toggle(force?: boolean) {
      this.isOpen = force !== undefined ? force : !this.isOpen;
      const panel = this.shadow.querySelector('.panel-wrapper');
      if (panel) {
        panel.classList.toggle('open', this.isOpen);
        if (this.isOpen) {
          this.populateVoices();
        }
      }
    }

    public updateReadingStatus(isReading: boolean, isPaused: boolean, currentText?: string) {
      const playBtn = this.shadow.querySelector('#btn-play-pause') as HTMLButtonElement | null;
      const statusText = this.shadow.querySelector('#reader-status-text') as HTMLElement | null;
      const previewBox = this.shadow.querySelector('#reader-preview') as HTMLElement | null;

      if (playBtn) {
        if (!isReading) {
          playBtn.innerHTML = `${ICONS.play}<span>Ouvir Página</span>`;
          playBtn.classList.remove('active-reading');
        } else if (isPaused) {
          playBtn.innerHTML = `${ICONS.play}<span>Continuar</span>`;
          playBtn.classList.remove('active-reading');
        } else {
          playBtn.innerHTML = `${ICONS.pause}<span>Pausar</span>`;
          playBtn.classList.add('active-reading');
        }
      }

      if (statusText) {
        if (!isReading) {
          statusText.textContent = 'Pronto para ler';
        } else if (isPaused) {
          statusText.textContent = 'Leitura pausada';
        } else {
          statusText.textContent = 'Capi está lendo...';
        }
      }

      if (previewBox && currentText) {
        previewBox.textContent =
          currentText.length > 90 ? currentText.substring(0, 90) + '...' : currentText;
        previewBox.style.display = isReading ? 'block' : 'none';
      } else if (previewBox && !isReading) {
        previewBox.style.display = 'none';
      }
    }

    private loadSettings() {
      try {
        const saved = localStorage.getItem('acre_acessivel_settings');
        if (saved) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
          // Segurança: nunca inicia com leitura por hover ativada para evitar disparos acidentais
          this.settings.readOnHover = false;
        }
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }

    private saveSettings() {
      try {
        localStorage.setItem('acre_acessivel_settings', JSON.stringify(this.settings));
      } catch {
        /* ignore */
      }
    }

    private injectGlobalStyles() {
      if (document.getElementById('acre-acessivel-global-styles')) return;

      const style = document.createElement('style');
      style.id = 'acre-acessivel-global-styles';
      style.textContent = `
        @import url('https://fonts.cdnfonts.com/css/opendyslexic');

        :root {
          --acre-font-multiplier: 1;
        }

        html.acre-custom-font,
        html.acre-custom-font body {
          font-size: calc(16px * var(--acre-font-multiplier)) !important;
        }

        .acre-acessivel-reading-highlight {
          outline: 3px solid #C8102E !important;
          background-color: rgba(242, 201, 76, 0.28) !important;
          border-radius: 4px !important;
          transition: background-color 0.2s ease, outline 0.2s ease !important;
        }

        html.acre-high-contrast {
          --bg-paper: #000000 !important;
          --bg-surface: #0a0a0a !important;
          --bg-elevated: #000000 !important;
          --ink-primary: #FFFFFF !important;
          --ink-secondary: #FFFF00 !important;
          --ink-muted: #00FF99 !important;
          --rule-strong: #FFFF00 !important;
          --rule-light: #FFFFFF !important;
        }

        html.acre-high-contrast,
        html.acre-high-contrast body,
        html.acre-high-contrast header,
        html.acre-high-contrast footer,
        html.acre-high-contrast main,
        html.acre-high-contrast section,
        html.acre-high-contrast article,
        html.acre-high-contrast .newspaper-shell,
        html.acre-high-contrast .editorial-nav,
        html.acre-high-contrast .doc-list,
        html.acre-high-contrast .doc-row {
          background-color: #000000 !important;
          color: #FFFFFF !important;
          border-color: #FFFF00 !important;
        }

        html.acre-high-contrast h1,
        html.acre-high-contrast h2,
        html.acre-high-contrast h3,
        html.acre-high-contrast h4,
        html.acre-high-contrast p,
        html.acre-high-contrast span,
        html.acre-high-contrast li {
          color: #FFFFFF !important;
        }

        html.acre-high-contrast a,
        html.acre-high-contrast button {
          color: #FFFF00 !important;
        }

        html.acre-dark-mode {
          --bg-paper: #121614 !important;
          --bg-surface: #1A201D !important;
          --bg-elevated: #1F2622 !important;
          --ink-primary: #EAE6DF !important;
          --ink-secondary: #C8C3B9 !important;
          --ink-muted: #9E988E !important;
          --rule-strong: #4A524D !important;
          --rule-light: #2C342F !important;
        }

        html.acre-dark-mode,
        html.acre-dark-mode body,
        html.acre-dark-mode header,
        html.acre-dark-mode footer,
        html.acre-dark-mode main,
        html.acre-dark-mode .editorial-nav,
        html.acre-dark-mode .doc-list {
          background-color: #121614 !important;
          color: #EAE6DF !important;
        }

        html.acre-dark-mode h1,
        html.acre-dark-mode h2,
        html.acre-dark-mode h3,
        html.acre-dark-mode p,
        html.acre-dark-mode span,
        html.acre-dark-mode li,
        html.acre-dark-mode a {
          color: #EAE6DF !important;
        }

        html.acre-dyslexic-font,
        html.acre-dyslexic-font body,
        html.acre-dyslexic-font p,
        html.acre-dyslexic-font h1,
        html.acre-dyslexic-font h2,
        html.acre-dyslexic-font h3,
        html.acre-dyslexic-font h4,
        html.acre-dyslexic-font span,
        html.acre-dyslexic-font a,
        html.acre-dyslexic-font li {
          font-family: 'OpenDyslexic', 'Comic Sans MS', Verdana, sans-serif !important;
        }

        html.acre-line-spacing p,
        html.acre-line-spacing li,
        html.acre-line-spacing span,
        html.acre-line-spacing div {
          line-height: 2.0 !important;
          letter-spacing: 0.06em !important;
          word-spacing: 0.14em !important;
        }

        html.acre-highlight-links a {
          background-color: #F2C94C !important;
          color: #000000 !important;
          text-decoration: underline !important;
          font-weight: bold !important;
          padding: 1px 4px !important;
          border-radius: 3px !important;
        }

        html.acre-stop-animations *,
        html.acre-stop-animations *::before,
        html.acre-stop-animations *::after {
          animation: none !important;
          transition: none !important;
        }

        #acre-reading-guide-bar {
          position: fixed;
          left: 0;
          width: 100vw;
          height: 36px;
          background: rgba(242, 201, 76, 0.25);
          border-top: 2px solid #008040;
          border-bottom: 2px solid #C8102E;
          pointer-events: none;
          z-index: 999990;
          display: none;
          transform: translateY(-50%);
        }
      `;
      document.head.appendChild(style);

      if (!document.getElementById('acre-reading-guide-bar')) {
        const guide = document.createElement('div');
        guide.id = 'acre-reading-guide-bar';
        document.body.appendChild(guide);
        this.readingGuideEl = guide;
      }
    }

    private applySettingsToPage() {
      const html = document.documentElement;
      const hasCustomFont = Math.abs(this.settings.fontScale - 1.0) > 0.01;
      html.classList.toggle('acre-custom-font', hasCustomFont);
      html.style.setProperty('--acre-font-multiplier', this.settings.fontScale.toString());

      html.classList.toggle('acre-high-contrast', this.settings.highContrast);
      html.classList.toggle('acre-dark-mode', this.settings.darkMode);
      html.classList.toggle('acre-dyslexic-font', this.settings.dyslexicFont);
      html.classList.toggle('acre-line-spacing', this.settings.lineSpacing);
      html.classList.toggle('acre-highlight-links', this.settings.highlightLinks);
      html.classList.toggle('acre-stop-animations', this.settings.stopAnimations);

      if (this.readingGuideEl) {
        this.readingGuideEl.style.display = this.settings.readingGuide ? 'block' : 'none';
      }

      if (this.voiceReader) {
        this.voiceReader.setRate(this.settings.speechRate);
        this.voiceReader.setReadOnHover(this.settings.readOnHover);
      }

      this.updateUIButtonsState();
      this.saveSettings();
    }

    private updateUIButtonsState() {
      const setBtnActive = (id: string, active: boolean) => {
        const btn = this.shadow.querySelector(`#${id}`);
        if (btn) {
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active.toString());
        }
      };

      setBtnActive('btn-contrast', this.settings.highContrast);
      setBtnActive('btn-dark', this.settings.darkMode);
      setBtnActive('btn-dyslexic', this.settings.dyslexicFont);
      setBtnActive('btn-spacing', this.settings.lineSpacing);
      setBtnActive('btn-links', this.settings.highlightLinks);
      setBtnActive('btn-guide', this.settings.readingGuide);
      setBtnActive('btn-animations', this.settings.stopAnimations);
      setBtnActive('btn-hover-read', this.settings.readOnHover);

      const fontLabel = this.shadow.querySelector('#font-scale-label');
      if (fontLabel) {
        fontLabel.textContent = `${Math.round(this.settings.fontScale * 100)}%`;
      }

      const rateLabel = this.shadow.querySelector('#speech-rate-label');
      if (rateLabel) {
        rateLabel.textContent = `${this.settings.speechRate.toFixed(1)}x`;
      }
    }

    private populateVoices() {
      if (!this.voiceReader) return;
      const select = this.shadow.querySelector('#voice-select') as HTMLSelectElement | null;
      if (!select) return;

      const voices = this.voiceReader.getAvailablePortugueseVoices();
      if (voices.length === 0) return;

      const currentVal = select.value;
      select.innerHTML = '';

      voices.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name.replace(/Microsoft |Google /g, '')} (${v.lang})`;
        select.appendChild(opt);
      });

      if (currentVal) {
        select.value = currentVal;
      }
    }

    private setupGlobalListeners() {
      document.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.settings.readingGuide && this.readingGuideEl) {
          this.readingGuideEl.style.top = `${e.clientY}px`;
        }
      });

      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.altKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          this.toggle();
        } else if (e.key === 'Escape' && this.isOpen) {
          this.toggle(false);
        }
      });
    }

    private render() {
      this.shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 102px;
          right: 24px;
          z-index: 999998;
          pointer-events: none;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .panel-wrapper {
          width: 350px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 130px);
          background: #FFFFFF;
          color: #1C2826;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22), 0 0 0 2px #008040;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          pointer-events: none;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .panel-wrapper.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .panel-header {
          background: linear-gradient(135deg, #008040 0%, #00592D 100%);
          color: #FFFFFF;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #F2C94C;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.3px;
        }

        .star-icon {
          color: #EB5757;
          background: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .panel-body {
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #5C6B64;
          font-weight: 700;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .voice-card {
          background: #F4F9F6;
          border: 1px solid #CBE5D6;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .voice-status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #00592D;
          font-weight: 600;
        }

        #reader-preview {
          display: none;
          font-size: 12px;
          background: #FFFFFF;
          padding: 8px 10px;
          border-radius: 8px;
          border-left: 3px solid #F2C94C;
          color: #333;
          font-style: italic;
          line-height: 1.4;
        }

        .voice-controls-row {
          display: flex;
          gap: 6px;
        }

        .btn-voice-main {
          flex: 1;
          background: #008040;
          color: white;
          border: none;
          padding: 10px 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-voice-main:hover {
          background: #006633;
        }

        .btn-voice-main.active-reading {
          background: #D97706;
        }

        .btn-voice-icon {
          background: #FFFFFF;
          border: 1px solid #CBE5D6;
          color: #1C2826;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-voice-icon:hover {
          background: #E6F2EC;
          border-color: #008040;
        }

        .speed-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          padding-top: 4px;
        }

        .stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          padding: 3px 6px;
          border-radius: 8px;
          border: 1px solid #D1DBD6;
        }

        .stepper button {
          background: #E8F0EC;
          border: none;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          color: #00592D;
        }

        .stepper button:hover {
          background: #008040;
          color: white;
        }

        .voice-select-row select {
          width: 100%;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #CBE5D6;
          font-size: 12px;
          background: white;
          color: #1C2826;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .feature-btn {
          background: #F8FAF9;
          border: 1.5px solid #E2ECE7;
          border-radius: 10px;
          padding: 10px 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #2A3B34;
          transition: all 0.2s ease;
          text-align: center;
        }

        .feature-btn:hover {
          border-color: #008040;
          background: #F0F7F3;
        }

        .feature-btn.active {
          background: #008040;
          color: #FFFFFF;
          border-color: #00592D;
          box-shadow: 0 3px 10px rgba(0, 128, 64, 0.25);
        }

        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: #008040;
          transition: color 0.2s ease;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
        }

        .feature-btn.active .feature-icon {
          color: #FFFFFF;
        }

        .font-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FAF9;
          border: 1.5px solid #E2ECE7;
          border-radius: 10px;
          padding: 8px 12px;
        }

        .panel-footer {
          padding: 10px 16px;
          background: #F4F6F5;
          border-top: 1px solid #E2ECE7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #607068;
        }

        .reset-btn {
          background: none;
          border: none;
          color: #D9383A;
          font-weight: 600;
          cursor: pointer;
          font-size: 11px;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          :host {
            right: 12px;
            bottom: 92px;
          }
          .panel-wrapper {
            width: calc(100vw - 24px);
          }
        }
      </style>

      <div class="panel-wrapper" role="dialog" aria-label="Painel de Acessibilidade Acre-Acessível">
        <div class="panel-header">
          <div class="header-title">
            <span class="star-icon">★</span>
            <span>Acre-Acessível · Capi</span>
          </div>
          <button class="close-btn" id="btn-close" aria-label="Fechar painel">${ICONS.close}</button>
        </div>

        <div class="panel-body">
          <div>
            <div class="section-title">${ICONS.speaker}<span>Leitor de Voz da Capi (PT-BR)</span></div>
            <div class="voice-card">
              <div class="voice-status-row">
                <span id="reader-status-text">Pronto para ler</span>
              </div>
              <div id="reader-preview"></div>

              <div class="voice-controls-row">
                <button class="btn-voice-icon" id="btn-prev" title="Parágrafo anterior" aria-label="Parágrafo anterior">${ICONS.prev}</button>
                <button class="btn-voice-main" id="btn-play-pause">${ICONS.play}<span>Ouvir Página</span></button>
                <button class="btn-voice-icon" id="btn-next" title="Próximo parágrafo" aria-label="Próximo parágrafo">${ICONS.next}</button>
                <button class="btn-voice-icon" id="btn-stop" title="Parar leitura" aria-label="Parar leitura">${ICONS.stop}</button>
              </div>

              <div class="speed-row">
                <span>Velocidade da Voz:</span>
                <div class="stepper">
                  <button id="btn-rate-down" aria-label="Diminuir velocidade">-</button>
                  <span id="speech-rate-label">1.1x</span>
                  <button id="btn-rate-up" aria-label="Aumentar velocidade">+</button>
                </div>
              </div>

              <div class="voice-select-row">
                <select id="voice-select" aria-label="Selecionar voz em português">
                  <option value="">Voz Padrão do Sistema (PT-BR)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div class="section-title">${ICONS.type}<span>Tamanho da Letra</span></div>
            <div class="font-control-bar">
              <span style="font-size: 13px; font-weight: 600;">Escala do Texto</span>
              <div class="stepper">
                <button id="btn-font-down" aria-label="Diminuir letra">A-</button>
                <span id="font-scale-label" style="min-width: 42px; text-align: center; font-weight: 700; font-size: 13px;">100%</span>
                <button id="btn-font-up" aria-label="Aumentar letra">A+</button>
              </div>
            </div>
          </div>

          <div>
            <div class="section-title">${ICONS.eye}<span>Ajustes Visuais e Leitura</span></div>
            <div class="features-grid">
              <button class="feature-btn" id="btn-hover-read">
                <span class="feature-icon">${ICONS.touch}</span>
                <span>Tocar/Apontar p/ Ouvir</span>
              </button>
              <button class="feature-btn" id="btn-contrast">
                <span class="feature-icon">${ICONS.contrast}</span>
                <span>Alto Contraste</span>
              </button>
              <button class="feature-btn" id="btn-dark">
                <span class="feature-icon">${ICONS.moon}</span>
                <span>Modo Escuro</span>
              </button>
              <button class="feature-btn" id="btn-dyslexic">
                <span class="feature-icon">${ICONS.dyslexic}</span>
                <span>Fonte Dislexia</span>
              </button>
              <button class="feature-btn" id="btn-spacing">
                <span class="feature-icon">${ICONS.spacing}</span>
                <span>Espaçamento</span>
              </button>
              <button class="feature-btn" id="btn-links">
                <span class="feature-icon">${ICONS.links}</span>
                <span>Destacar Links</span>
              </button>
              <button class="feature-btn" id="btn-guide">
                <span class="feature-icon">${ICONS.ruler}</span>
                <span>Guia de Leitura</span>
              </button>
              <button class="feature-btn" id="btn-animations">
                <span class="feature-icon">${ICONS.pauseMotion}</span>
                <span>Pausar Animações</span>
              </button>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <span>Atalho: <strong>Alt + A</strong></span>
          <button class="reset-btn" id="btn-reset">Restaurar Padrão</button>
        </div>
      </div>
    `;

      this.bindPanelEvents();
    }

    private bindPanelEvents() {
      const q = (sel: string) => this.shadow.querySelector(sel);

      q('#btn-close')?.addEventListener('click', () => this.toggle(false));

      q('#btn-play-pause')?.addEventListener('click', () => {
        if (!this.voiceReader) return;
        const st = this.voiceReader.getStatus();
        if (!st.isReading) {
          this.voiceReader.startPageReading(true);
        } else if (st.isPaused) {
          this.voiceReader.resume();
        } else {
          this.voiceReader.pause();
        }
      });

      q('#btn-stop')?.addEventListener('click', () => this.voiceReader?.stop());
      q('#btn-prev')?.addEventListener('click', () => this.voiceReader?.previousElement());
      q('#btn-next')?.addEventListener('click', () => this.voiceReader?.nextElement());

      q('#btn-rate-down')?.addEventListener('click', () => {
        this.settings.speechRate = Math.max(0.6, +(this.settings.speechRate - 0.1).toFixed(1));
        this.applySettingsToPage();
      });

      q('#btn-rate-up')?.addEventListener('click', () => {
        this.settings.speechRate = Math.min(2.0, +(this.settings.speechRate + 0.1).toFixed(1));
        this.applySettingsToPage();
      });

      q('#voice-select')?.addEventListener('change', (e: Event) => {
        const val = (e.target as HTMLSelectElement).value;
        if (val && this.voiceReader) {
          this.voiceReader.setVoiceByName(val);
        }
      });

      q('#btn-font-down')?.addEventListener('click', () => {
        this.settings.fontScale = Math.max(0.8, +(this.settings.fontScale - 0.1).toFixed(2));
        this.applySettingsToPage();
      });

      q('#btn-font-up')?.addEventListener('click', () => {
        this.settings.fontScale = Math.min(1.6, +(this.settings.fontScale + 0.1).toFixed(2));
        this.applySettingsToPage();
      });

      q('#btn-hover-read')?.addEventListener('click', () => {
        this.settings.readOnHover = !this.settings.readOnHover;
        this.applySettingsToPage();
      });

      q('#btn-contrast')?.addEventListener('click', () => {
        this.settings.highContrast = !this.settings.highContrast;
        if (this.settings.highContrast) this.settings.darkMode = false;
        this.applySettingsToPage();
      });

      q('#btn-dark')?.addEventListener('click', () => {
        this.settings.darkMode = !this.settings.darkMode;
        if (this.settings.darkMode) this.settings.highContrast = false;
        this.applySettingsToPage();
      });

      q('#btn-dyslexic')?.addEventListener('click', () => {
        this.settings.dyslexicFont = !this.settings.dyslexicFont;
        this.applySettingsToPage();
      });

      q('#btn-spacing')?.addEventListener('click', () => {
        this.settings.lineSpacing = !this.settings.lineSpacing;
        this.applySettingsToPage();
      });

      q('#btn-links')?.addEventListener('click', () => {
        this.settings.highlightLinks = !this.settings.highlightLinks;
        this.applySettingsToPage();
      });

      q('#btn-guide')?.addEventListener('click', () => {
        this.settings.readingGuide = !this.settings.readingGuide;
        this.applySettingsToPage();
      });

      q('#btn-animations')?.addEventListener('click', () => {
        this.settings.stopAnimations = !this.settings.stopAnimations;
        this.applySettingsToPage();
      });

      q('#btn-reset')?.addEventListener('click', () => {
        this.settings = { ...DEFAULT_SETTINGS };
        this.applySettingsToPage();
        this.voiceReader?.stop();
      });
    }
  }

  customElements.define('acre-accessibility-panel', AcreAccessibilityPanel);
}
