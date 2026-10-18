/**
 * CapiMascot - Web Component do Mascote Capivara Acreana (Acre-Acessível)
 * Seguro para SSR: registra Custom Element apenas quando no navegador.
 */

export function registerCapiMascot(): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get('capi-mascot')) return;

  class CapiMascot extends HTMLElement {
    private shadow: ShadowRoot;
    private state: 'idle' | 'speaking' | 'listening' = 'idle';

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['state'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'state' && oldValue !== newValue) {
        this.state = newValue as 'idle' | 'speaking' | 'listening';
        this.updateAnimationState();
      }
    }

    connectedCallback() {
      this.render();
    }

    public setState(newState: 'idle' | 'speaking' | 'listening') {
      this.setAttribute('state', newState);
    }

    private updateAnimationState() {
      const container = this.shadow.querySelector('.mascot-container');
      if (container) {
        container.className = `mascot-container state-${this.state}`;
      }
    }

    private render() {
      this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999999;
          cursor: pointer;
          user-select: none;
          font-family: system-ui, -apple-system, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 640px) {
          :host {
            bottom: 16px;
            right: 16px;
          }
        }

        .mascot-container {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #008040 0%, #00592D 100%);
          box-shadow: 0 6px 20px rgba(0, 89, 45, 0.35), 0 0 0 3px #FFFFFF, 0 0 0 5px #F2C94C;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        .mascot-container:hover {
          transform: scale(1.08) translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 89, 45, 0.45), 0 0 0 3px #FFFFFF, 0 0 0 6px #F2C94C;
        }

        .mascot-container:active {
          transform: scale(0.95);
        }

        .mascot-container:focus-visible {
          outline: 4px solid #EB5757;
          outline-offset: 4px;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #EB5757;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }

        .tooltip {
          position: absolute;
          right: 84px;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          background: #1A2E22;
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          border-left: 4px solid #F2C94C;
        }

        .tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-style: solid;
          border-color: transparent transparent transparent #1A2E22;
        }

        @media (hover: hover) {
          .mascot-container:hover .tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        svg {
          width: 52px;
          height: 52px;
          overflow: visible;
        }

        .head-group {
          transform-origin: 50px 55px;
          animation: breathe 4s ease-in-out infinite;
        }

        .eye-lid {
          transform-origin: 50px 42px;
          animation: blink 4.5s infinite;
        }

        .ear-left, .ear-right {
          transform-origin: 30px 28px;
          animation: ear-twitch 6s infinite;
        }
        .ear-right {
          transform-origin: 70px 28px;
          animation-delay: 0.2s;
        }

        .mouth-speaking {
          opacity: 0;
          transform-origin: 50px 68px;
        }

        .sound-waves {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .state-speaking .mascot-container,
        .mascot-container.state-speaking {
          box-shadow: 0 6px 25px rgba(0, 128, 64, 0.6), 0 0 0 3px #FFFFFF, 0 0 0 6px #00E676;
        }

        .state-speaking .head-group {
          animation: talk-bob 0.6s ease-in-out infinite alternate;
        }

        .state-speaking .mouth-idle {
          opacity: 0;
        }

        .state-speaking .mouth-speaking {
          opacity: 1;
          animation: mouth-talk 0.28s ease-in-out infinite alternate;
        }

        .state-speaking .sound-waves {
          opacity: 1;
        }

        .state-speaking .wave-1 {
          animation: pulse-wave 1s infinite;
        }
        .state-speaking .wave-2 {
          animation: pulse-wave 1s infinite 0.3s;
        }

        @keyframes breathe {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }

        @keyframes blink {
          0%, 94%, 98%, 100% { transform: scaleY(0); }
          96% { transform: scaleY(1); }
        }

        @keyframes ear-twitch {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-8deg); }
          96% { transform: rotate(5deg); }
        }

        @keyframes talk-bob {
          0% { transform: translateY(0) rotate(-1.5deg); }
          100% { transform: translateY(-3px) rotate(1.5deg); }
        }

        @keyframes mouth-talk {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.15); }
        }

        @keyframes pulse-wave {
          0% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .head-group, .eye-lid, .ear-left, .ear-right, .mouth-speaking, .wave-1, .wave-2 {
            animation: none !important;
          }
        }
      </style>

      <div class="mascot-container state-${this.state}" role="button" tabindex="0" aria-label="Abrir assistente de acessibilidade e leitor de voz Acre-Acessível">
        <div class="tooltip">Acessibilidade e Voz (Capi)</div>
        <div class="badge" title="Estrela Solitária do Acre">★</div>

        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g class="sound-waves" stroke="#F2C94C" stroke-width="3" fill="none" stroke-linecap="round">
            <path class="wave-1" d="M 12 35 Q 4 50 12 65" />
            <path class="wave-2" d="M 88 35 Q 96 50 88 65" />
          </g>

          <g class="head-group">
            <g class="ear-left">
              <ellipse cx="26" cy="26" rx="8" ry="10" fill="#7A4B2A" transform="rotate(-20 26 26)" />
              <ellipse cx="26" cy="26" rx="4" ry="6" fill="#4E2F18" transform="rotate(-20 26 26)" />
            </g>
            <g class="ear-right">
              <ellipse cx="74" cy="26" rx="8" ry="10" fill="#7A4B2A" transform="rotate(20 74 26)" />
              <ellipse cx="74" cy="26" rx="4" ry="6" fill="#4E2F18" transform="rotate(20 74 26)" />
            </g>

            <path d="M 28 18 C 35 8, 65 8, 72 18 C 76 22, 24 22, 28 18 Z" fill="#F2C94C" stroke="#D4AC0D" stroke-width="1.5"/>
            <path d="M 22 18 Q 50 13 78 18 Q 82 21 75 22 Q 50 18 25 22 Q 18 21 22 18 Z" fill="#E6B800"/>
            <polygon points="50,10 51.5,13 55,13.5 52.5,16 53,19.5 50,17.8 47,19.5 47.5,16 45,13.5 48.5,13" fill="#EB5757" />

            <rect x="22" y="22" width="56" height="54" rx="26" fill="#9C643B" />
            <path d="M 22 48 C 22 65, 34 76, 50 76 C 66 76, 78 65, 78 48 Z" fill="#8A5630" opacity="0.5" />

            <ellipse cx="32" cy="52" rx="5" ry="3" fill="#E58C7E" opacity="0.5" />
            <ellipse cx="68" cy="52" rx="5" ry="3" fill="#E58C7E" opacity="0.5" />

            <g class="eyes">
              <circle cx="35" cy="42" r="4.5" fill="#1E130C" />
              <circle cx="33.5" cy="40.5" r="1.5" fill="#FFFFFF" />
              <circle cx="65" cy="42" r="4.5" fill="#1E130C" />
              <circle cx="63.5" cy="40.5" r="1.5" fill="#FFFFFF" />
            </g>

            <g class="eye-lid">
              <ellipse cx="35" cy="42" rx="5.5" ry="5" fill="#7A4B2A" />
              <ellipse cx="65" cy="42" rx="5.5" ry="5" fill="#7A4B2A" />
            </g>

            <g fill="none" stroke="#1A2E22" stroke-width="2.2">
              <rect x="25" y="34" width="20" height="15" rx="5" fill="rgba(255,255,255,0.12)" />
              <rect x="55" y="34" width="20" height="15" rx="5" fill="rgba(255,255,255,0.12)" />
              <line x1="45" y1="41" x2="55" y2="41" />
              <line x1="22" y1="40" x2="25" y2="40" />
              <line x1="75" y1="40" x2="78" y2="40" />
            </g>

            <rect x="34" y="47" width="32" height="24" rx="12" fill="#6E4223" />
            <ellipse cx="44" cy="53" rx="2.5" ry="1.8" fill="#2D1A0E" transform="rotate(-15 44 53)" />
            <ellipse cx="56" cy="53" rx="2.5" ry="1.8" fill="#2D1A0E" transform="rotate(15 56 53)" />

            <g class="mouth-idle" stroke="#2D1A0E" stroke-width="2.2" fill="none" stroke-linecap="round">
              <line x1="50" y1="56" x2="50" y2="62" />
              <path d="M 43 63 Q 46.5 66 50 62 Q 53.5 66 57 63" />
            </g>

            <g class="mouth-speaking">
              <path d="M 42 62 Q 50 73 58 62 Z" fill="#3B1518" stroke="#2D1A0E" stroke-width="1.8" />
              <path d="M 46 67 Q 50 65 54 67 Q 50 70 46 67 Z" fill="#EB5757" />
              <rect x="47" y="62" width="3" height="2.5" rx="0.5" fill="#FFF8E7" />
              <rect x="50.5" y="62" width="3" height="2.5" rx="0.5" fill="#FFF8E7" />
            </g>

            <path d="M 32 73 L 50 82 L 68 73 L 64 84 L 50 88 L 36 84 Z" fill="#008040" />
            <path d="M 50 82 L 68 73 L 64 84 L 50 88 Z" fill="#F2C94C" />
            <circle cx="50" cy="83" r="3" fill="#EB5757" />
          </g>
        </svg>
      </div>
    `;

      const container = this.shadow.querySelector('.mascot-container');
      container?.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('toggle-panel', { bubbles: true, composed: true }));
      });

      container?.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          this.dispatchEvent(new CustomEvent('toggle-panel', { bubbles: true, composed: true }));
        }
      });
    }
  }

  customElements.define('capi-mascot', CapiMascot);
}
