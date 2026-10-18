/**
 * Acre-Acessível - Ponto de Entrada Principal do Plugin
 * Orquestra o Mascote Capi, o Painel de Acessibilidade e o Motor de Voz PT-BR.
 */

import { registerCapiMascot } from './capi-mascot';
import {
  registerAccessibilityPanel,
  type AccessibilityPanelElement,
} from './accessibility-panel';
import { VoiceReader, type ReaderStructureConfig } from './voice-reader';

export interface WidgetConfig {
  position?: 'bottom-right' | 'bottom-left';
  greetingText?: string;
  autoGreet?: boolean;
  lang?: string;
  backendUrl?: string;
  reader?: ReaderStructureConfig;
}

class AcreAcessivelPlugin {
  private mascot: HTMLElement | null = null;
  private panel: AccessibilityPanelElement | null = null;
  private voiceReader: VoiceReader | null = null;
  private initialized = false;

  public init(config: WidgetConfig = {}) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (this.initialized) return;
    this.initialized = true;

    registerCapiMascot();
    registerAccessibilityPanel();

    const mount = () => {
      this.mountComponents(config);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
      mount();
    }
  }

  private mountComponents(config: WidgetConfig) {
    if (document.querySelector('capi-mascot')) return;

    const mascotEl = document.createElement('capi-mascot');
    const panelEl = document.createElement(
      'acre-accessibility-panel',
    ) as AccessibilityPanelElement;

    if (config.position === 'bottom-left') {
      mascotEl.style.right = 'auto';
      mascotEl.style.left = '24px';
      panelEl.style.right = 'auto';
      panelEl.style.left = '24px';
    }

    const setMascotState = (state: 'idle' | 'speaking' | 'listening') => {
      mascotEl.setAttribute('state', state);
    };

    this.voiceReader = new VoiceReader(
      {
        onStart: () => {
          setMascotState('speaking');
          panelEl.updateReadingStatus(true, false);
        },
        onStop: () => {
          setMascotState('idle');
          panelEl.updateReadingStatus(false, false);
        },
        onPause: () => {
          setMascotState('idle');
          panelEl.updateReadingStatus(true, true);
        },
        onResume: () => {
          setMascotState('speaking');
          panelEl.updateReadingStatus(true, false);
        },
        onSentenceChange: (_el, text) => {
          panelEl.updateReadingStatus(true, false, text);
        },
      },
      {
        ...config.reader,
        backendUrl: config.backendUrl ?? config.reader?.backendUrl,
      },
    );

    panelEl.setVoiceReader(this.voiceReader);

    mascotEl.addEventListener('toggle-panel', () => {
      panelEl.toggle();
    });

    document.body.appendChild(panelEl);
    document.body.appendChild(mascotEl);

    this.mascot = mascotEl;
    this.panel = panelEl;
  }

  public speak(text: string) {
    this.voiceReader?.speakDirectText(text);
  }

  public stop() {
    this.voiceReader?.stop();
  }

  public openPanel() {
    this.panel?.toggle(true);
  }

  public closePanel() {
    this.panel?.toggle(false);
  }

  public onRouteChange() {
    this.voiceReader?.onRouteChange();
  }
}

export const AcreAcessivel = new AcreAcessivelPlugin();

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).AcreAcessivel = AcreAcessivel;
}

export default AcreAcessivel;
