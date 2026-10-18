"use strict";(()=>{function f(){if(typeof window>"u"||typeof customElements>"u"||customElements.get("capi-mascot"))return;class h extends HTMLElement{shadow;state="idle";constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["state"]}attributeChangedCallback(e,i,s){e==="state"&&i!==s&&(this.state=s,this.updateAnimationState())}connectedCallback(){this.render()}setState(e){this.setAttribute("state",e)}updateAnimationState(){let e=this.shadow.querySelector(".mascot-container");e&&(e.className=`mascot-container state-${this.state}`)}render(){this.shadow.innerHTML=`
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

      <div class="mascot-container state-${this.state}" role="button" tabindex="0" aria-label="Abrir assistente de acessibilidade e leitor de voz Acre-Acess\xEDvel">
        <div class="tooltip">Acessibilidade e Voz (Capi)</div>
        <div class="badge" title="Estrela Solit\xE1ria do Acre">\u2605</div>

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
    `;let e=this.shadow.querySelector(".mascot-container");e?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("toggle-panel",{bubbles:!0,composed:!0}))}),e?.addEventListener("keydown",i=>{let s=i;(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),this.dispatchEvent(new CustomEvent("toggle-panel",{bubbles:!0,composed:!0})))})}}customElements.define("capi-mascot",h)}var p={fontScale:1,highContrast:!1,darkMode:!1,dyslexicFont:!1,lineSpacing:!1,highlightLinks:!1,readingGuide:!1,stopAnimations:!1,speechRate:1.05,readOnHover:!1},d={play:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>',pause:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',prev:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',next:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',stop:'<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',speaker:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',close:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',type:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',eye:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',touch:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>',contrast:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z" fill="currentColor"/></svg>',moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',dyslexic:'<span style="font-family:serif;font-weight:700;font-size:15px;letter-spacing:-0.5px;">Abc</span>',spacing:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',links:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',ruler:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',pauseMotion:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>'};function v(){if(typeof window>"u"||typeof customElements>"u"||customElements.get("acre-accessibility-panel"))return;class h extends HTMLElement{shadow;isOpen=!1;settings={...p};voiceReader=null;readingGuideEl=null;constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.loadSettings()}setVoiceReader(e){this.voiceReader=e,this.voiceReader.setRate(this.settings.speechRate),this.voiceReader.setReadOnHover(this.settings.readOnHover),this.populateVoices()}connectedCallback(){this.injectGlobalStyles(),this.render(),this.applySettingsToPage(),this.setupGlobalListeners()}toggle(e){this.isOpen=e!==void 0?e:!this.isOpen;let i=this.shadow.querySelector(".panel-wrapper");i&&(i.classList.toggle("open",this.isOpen),this.isOpen&&this.populateVoices())}updateReadingStatus(e,i,s){let r=this.shadow.querySelector("#btn-play-pause"),n=this.shadow.querySelector("#reader-status-text"),a=this.shadow.querySelector("#reader-preview");r&&(e?i?(r.innerHTML=`${d.play}<span>Continuar</span>`,r.classList.remove("active-reading")):(r.innerHTML=`${d.pause}<span>Pausar</span>`,r.classList.add("active-reading")):(r.innerHTML=`${d.play}<span>Ouvir P\xE1gina</span>`,r.classList.remove("active-reading"))),n&&(e?i?n.textContent="Leitura pausada":n.textContent="Capi est\xE1 lendo...":n.textContent="Pronto para ler"),a&&s?(a.textContent=s.length>90?s.substring(0,90)+"...":s,a.style.display=e?"block":"none"):a&&!e&&(a.style.display="none")}loadSettings(){try{let e=localStorage.getItem("acre_acessivel_settings");e&&(this.settings={...p,...JSON.parse(e)},this.settings.readOnHover=!1)}catch{this.settings={...p}}}saveSettings(){try{localStorage.setItem("acre_acessivel_settings",JSON.stringify(this.settings))}catch{}}injectGlobalStyles(){if(document.getElementById("acre-acessivel-global-styles"))return;let e=document.createElement("style");if(e.id="acre-acessivel-global-styles",e.textContent=`
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
      `,document.head.appendChild(e),!document.getElementById("acre-reading-guide-bar")){let i=document.createElement("div");i.id="acre-reading-guide-bar",document.body.appendChild(i),this.readingGuideEl=i}}applySettingsToPage(){let e=document.documentElement,i=Math.abs(this.settings.fontScale-1)>.01;e.classList.toggle("acre-custom-font",i),e.style.setProperty("--acre-font-multiplier",this.settings.fontScale.toString()),e.classList.toggle("acre-high-contrast",this.settings.highContrast),e.classList.toggle("acre-dark-mode",this.settings.darkMode),e.classList.toggle("acre-dyslexic-font",this.settings.dyslexicFont),e.classList.toggle("acre-line-spacing",this.settings.lineSpacing),e.classList.toggle("acre-highlight-links",this.settings.highlightLinks),e.classList.toggle("acre-stop-animations",this.settings.stopAnimations),this.readingGuideEl&&(this.readingGuideEl.style.display=this.settings.readingGuide?"block":"none"),this.voiceReader&&(this.voiceReader.setRate(this.settings.speechRate),this.voiceReader.setReadOnHover(this.settings.readOnHover)),this.updateUIButtonsState(),this.saveSettings()}updateUIButtonsState(){let e=(r,n)=>{let a=this.shadow.querySelector(`#${r}`);a&&(a.classList.toggle("active",n),a.setAttribute("aria-pressed",n.toString()))};e("btn-contrast",this.settings.highContrast),e("btn-dark",this.settings.darkMode),e("btn-dyslexic",this.settings.dyslexicFont),e("btn-spacing",this.settings.lineSpacing),e("btn-links",this.settings.highlightLinks),e("btn-guide",this.settings.readingGuide),e("btn-animations",this.settings.stopAnimations),e("btn-hover-read",this.settings.readOnHover);let i=this.shadow.querySelector("#font-scale-label");i&&(i.textContent=`${Math.round(this.settings.fontScale*100)}%`);let s=this.shadow.querySelector("#speech-rate-label");s&&(s.textContent=`${this.settings.speechRate.toFixed(1)}x`)}populateVoices(){if(!this.voiceReader)return;let e=this.shadow.querySelector("#voice-select");if(!e)return;let i=this.voiceReader.getAvailablePortugueseVoices();if(i.length===0)return;let s=e.value;e.innerHTML="",i.forEach(r=>{let n=document.createElement("option");n.value=r.name,n.textContent=`${r.name.replace(/Microsoft |Google /g,"")} (${r.lang})`,e.appendChild(n)}),s&&(e.value=s)}setupGlobalListeners(){document.addEventListener("mousemove",e=>{this.settings.readingGuide&&this.readingGuideEl&&(this.readingGuideEl.style.top=`${e.clientY}px`)}),document.addEventListener("keydown",e=>{e.altKey&&e.key.toLowerCase()==="a"?(e.preventDefault(),this.toggle()):e.key==="Escape"&&this.isOpen&&this.toggle(!1)})}render(){this.shadow.innerHTML=`
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

      <div class="panel-wrapper" role="dialog" aria-label="Painel de Acessibilidade Acre-Acess\xEDvel">
        <div class="panel-header">
          <div class="header-title">
            <span class="star-icon">\u2605</span>
            <span>Acre-Acess\xEDvel \xB7 Capi</span>
          </div>
          <button class="close-btn" id="btn-close" aria-label="Fechar painel">${d.close}</button>
        </div>

        <div class="panel-body">
          <div>
            <div class="section-title">${d.speaker}<span>Leitor de Voz da Capi (PT-BR)</span></div>
            <div class="voice-card">
              <div class="voice-status-row">
                <span id="reader-status-text">Pronto para ler</span>
              </div>
              <div id="reader-preview"></div>

              <div class="voice-controls-row">
                <button class="btn-voice-icon" id="btn-prev" title="Par\xE1grafo anterior" aria-label="Par\xE1grafo anterior">${d.prev}</button>
                <button class="btn-voice-main" id="btn-play-pause">${d.play}<span>Ouvir P\xE1gina</span></button>
                <button class="btn-voice-icon" id="btn-next" title="Pr\xF3ximo par\xE1grafo" aria-label="Pr\xF3ximo par\xE1grafo">${d.next}</button>
                <button class="btn-voice-icon" id="btn-stop" title="Parar leitura" aria-label="Parar leitura">${d.stop}</button>
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
                <select id="voice-select" aria-label="Selecionar voz em portugu\xEAs">
                  <option value="">Voz Padr\xE3o do Sistema (PT-BR)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div class="section-title">${d.type}<span>Tamanho da Letra</span></div>
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
            <div class="section-title">${d.eye}<span>Ajustes Visuais e Leitura</span></div>
            <div class="features-grid">
              <button class="feature-btn" id="btn-hover-read">
                <span class="feature-icon">${d.touch}</span>
                <span>Tocar/Apontar p/ Ouvir</span>
              </button>
              <button class="feature-btn" id="btn-contrast">
                <span class="feature-icon">${d.contrast}</span>
                <span>Alto Contraste</span>
              </button>
              <button class="feature-btn" id="btn-dark">
                <span class="feature-icon">${d.moon}</span>
                <span>Modo Escuro</span>
              </button>
              <button class="feature-btn" id="btn-dyslexic">
                <span class="feature-icon">${d.dyslexic}</span>
                <span>Fonte Dislexia</span>
              </button>
              <button class="feature-btn" id="btn-spacing">
                <span class="feature-icon">${d.spacing}</span>
                <span>Espa\xE7amento</span>
              </button>
              <button class="feature-btn" id="btn-links">
                <span class="feature-icon">${d.links}</span>
                <span>Destacar Links</span>
              </button>
              <button class="feature-btn" id="btn-guide">
                <span class="feature-icon">${d.ruler}</span>
                <span>Guia de Leitura</span>
              </button>
              <button class="feature-btn" id="btn-animations">
                <span class="feature-icon">${d.pauseMotion}</span>
                <span>Pausar Anima\xE7\xF5es</span>
              </button>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <span>Atalho: <strong>Alt + A</strong></span>
          <button class="reset-btn" id="btn-reset">Restaurar Padr\xE3o</button>
        </div>
      </div>
    `,this.bindPanelEvents()}bindPanelEvents(){let e=i=>this.shadow.querySelector(i);e("#btn-close")?.addEventListener("click",()=>this.toggle(!1)),e("#btn-play-pause")?.addEventListener("click",()=>{if(!this.voiceReader)return;let i=this.voiceReader.getStatus();i.isReading?i.isPaused?this.voiceReader.resume():this.voiceReader.pause():this.voiceReader.startPageReading(!0)}),e("#btn-stop")?.addEventListener("click",()=>this.voiceReader?.stop()),e("#btn-prev")?.addEventListener("click",()=>this.voiceReader?.previousElement()),e("#btn-next")?.addEventListener("click",()=>this.voiceReader?.nextElement()),e("#btn-rate-down")?.addEventListener("click",()=>{this.settings.speechRate=Math.max(.6,+(this.settings.speechRate-.1).toFixed(1)),this.applySettingsToPage()}),e("#btn-rate-up")?.addEventListener("click",()=>{this.settings.speechRate=Math.min(2,+(this.settings.speechRate+.1).toFixed(1)),this.applySettingsToPage()}),e("#voice-select")?.addEventListener("change",i=>{let s=i.target.value;s&&this.voiceReader&&this.voiceReader.setVoiceByName(s)}),e("#btn-font-down")?.addEventListener("click",()=>{this.settings.fontScale=Math.max(.8,+(this.settings.fontScale-.1).toFixed(2)),this.applySettingsToPage()}),e("#btn-font-up")?.addEventListener("click",()=>{this.settings.fontScale=Math.min(1.6,+(this.settings.fontScale+.1).toFixed(2)),this.applySettingsToPage()}),e("#btn-hover-read")?.addEventListener("click",()=>{this.settings.readOnHover=!this.settings.readOnHover,this.applySettingsToPage()}),e("#btn-contrast")?.addEventListener("click",()=>{this.settings.highContrast=!this.settings.highContrast,this.settings.highContrast&&(this.settings.darkMode=!1),this.applySettingsToPage()}),e("#btn-dark")?.addEventListener("click",()=>{this.settings.darkMode=!this.settings.darkMode,this.settings.darkMode&&(this.settings.highContrast=!1),this.applySettingsToPage()}),e("#btn-dyslexic")?.addEventListener("click",()=>{this.settings.dyslexicFont=!this.settings.dyslexicFont,this.applySettingsToPage()}),e("#btn-spacing")?.addEventListener("click",()=>{this.settings.lineSpacing=!this.settings.lineSpacing,this.applySettingsToPage()}),e("#btn-links")?.addEventListener("click",()=>{this.settings.highlightLinks=!this.settings.highlightLinks,this.applySettingsToPage()}),e("#btn-guide")?.addEventListener("click",()=>{this.settings.readingGuide=!this.settings.readingGuide,this.applySettingsToPage()}),e("#btn-animations")?.addEventListener("click",()=>{this.settings.stopAnimations=!this.settings.stopAnimations,this.applySettingsToPage()}),e("#btn-reset")?.addEventListener("click",()=>{this.settings={...p},this.applySettingsToPage(),this.voiceReader?.stop()})}}customElements.define("acre-accessibility-panel",h)}var E=["","um","dois","tr\xEAs","quatro","cinco","seis","sete","oito","nove"],S=["dez","onze","doze","treze","quatorze","quinze","dezesseis","dezessete","dezoito","dezenove"],k=["","","vinte","trinta","quarenta","cinquenta","sessenta","setenta","oitenta","noventa"],C=["","cento","duzentos","trezentos","quatrocentos","quinhentos","seiscentos","setecentos","oitocentos","novecentos"],w={"01":"janeiro",1:"janeiro","02":"fevereiro",2:"fevereiro","03":"mar\xE7o",3:"mar\xE7o","04":"abril",4:"abril","05":"maio",5:"maio","06":"junho",6:"junho","07":"julho",7:"julho","08":"agosto",8:"agosto","09":"setembro",9:"setembro",10:"outubro",11:"novembro",12:"dezembro"},A={AC:"Acre",UFAC:"Ufac",SEFAZ:"Sefaz",DETRAN:"Detran",SESACRE:"Sesacre",SEE:"Secretaria de Educa\xE7\xE3o",SEJUSP:"Sejusp",MPAC:"Minist\xE9rio P\xFAblico do Acre",TJAC:"Tribunal de Justi\xE7a do Acre",ALEAC:"Assembleia Legislativa do Acre",GOV:"Governo",CPF:"C\xEA P\xEA \xC9fe",RG:"Erre G\xEA",CNPJ:"C\xEA Ene P\xEA Jota",CEP:"C\xEA \xC9 P\xEA",SUS:"S\xFAs",INSS:"I Ene \xC9sse \xC9sse",IBGE:"I B\xEA G\xEA \xC9",ONU:"\xD4nu",MEC:"M\xE9c",ENEM:"Enem",PIX:"P\xEDx",PDF:"P\xEA D\xEA \xC9fe",URL:"U Erre \xC9le",HTML:"Ag\xE1 T\xEA Eme \xC9le",CSS:"C\xEA \xC9sse \xC9sse",API:"A P\xEA I",TTS:"Texto para Fala",WCAG:"D\xE1blio C\xEA A G\xEA",EMAG:"\xEA-M\xE1g",COVID:"Cov\xEDd",UTI:"U T\xEA I",UBS:"U B\xEA \xC9sse",UPA:"\xDApa",SAMU:"Sam\xFA",PM:"Pol\xEDcia Militar",PC:"Pol\xEDcia Civil",BM:"Bombeiros Militares",BO:"Boletim de Ocorr\xEAncia",CNH:"C\xEA Ene Ag\xE1",IPVA:"I P\xEA V\xEA A",ICMS:"I C\xEA Eme \xC9sse",IPTU:"I P\xEA T\xEA U",FGTS:"\xC9fe G\xEA T\xEA \xC9sse",CLT:"C\xEA \xC9le T\xEA",MEI:"M\xEAi",PME:"P\xEA Eme \xC9",SEBRAE:"Sebr\xE1e",SENAC:"Sen\xE1c",SENAI:"Sen\xE1i",SESC:"S\xE9sc",SESI:"S\xE9si",OAB:"\xD3 A B\xEA",CRM:"C\xEA Erre Eme",CREA:"Cr\xEAa",CAU:"C\xE1u",CRP:"C\xEA Erre P\xEA",COREN:"Cor\xE9n",CRO:"C\xEA Erre \xD3",CRF:"C\xEA Erre \xC9fe",CREF:"Cr\xE9fe",CRESS:"Cr\xE9ss",CONFEA:"Conf\xEAa",IBAMA:"Ibama",ICMBIO:"I C\xEA Eme Bio",FUNAI:"Fun\xE1i",INCRA:"\xCDncra",DNIT:"D\xEAnit",ANATEL:"Anat\xE9l",ANEEL:"An\xE9el",ANP:"A Ene P\xEA",ANVISA:"Anv\xEDsa",ANS:"A Ene \xC9sse",ANA:"\xC2na",ANTAQ:"Ant\xE1q",ANTT:"A Ene T\xEA T\xEA",ANAC:"An\xE1c",INFRAERO:"Infra\xE9ro",CORREIOS:"Corr\xEAios",CAIXA:"C\xE1ixa",BB:"Banco do Brasil",BASA:"B\xE1sa",BNDES:"B\xEA Ene D\xEA \xC9sse",BACEN:"Bac\xE9n",CVM:"C\xEA V\xEA Eme",STF:"\xC9sse T\xEA \xC9fe",STJ:"\xC9sse T\xEA Jota",TST:"T\xEA \xC9sse T\xEA",TSE:"T\xEA \xC9sse \xC9",STM:"\xC9sse T\xEA Eme",CNJ:"C\xEA Ene Jota",CNMP:"C\xEA Ene Eme P\xEA",AGU:"A G\xEA U",PF:"Pol\xEDcia Federal",PRF:"Pol\xEDcia Rodovi\xE1ria Federal",ABIN:"Ab\xEDn",GSI:"G\xEA \xC9sse I",MD:"Minist\xE9rio da Defesa",MRE:"Itamaraty",MF:"Minist\xE9rio da Fazenda",MP:"Minist\xE9rio P\xFAblico",MJ:"Minist\xE9rio da Justi\xE7a",MS:"Minist\xE9rio da Sa\xFAde",MT:"Minist\xE9rio do Trabalho",MMA:"Minist\xE9rio do Meio Ambiente",MCTI:"Eme C\xEA T\xEA I",MINC:"M\xEDnc",ME:"Minist\xE9rio da Economia",MAPA:"M\xE1pa",MDR:"Eme D\xEA Erre",MMFDH:"Direitos Humanos",CGU:"C\xEA G\xEA U",TCU:"T\xEA C\xEA U",TCE:"T\xEA C\xEA \xC9",MPC:"Eme P\xEA C\xEA",PGE:"P\xEA G\xEA \xC9",PGM:"P\xEA G\xEA Eme",DPE:"Defensoria P\xFAblica",DPU:"Defensoria P\xFAblica da Uni\xE3o",PROCON:"Proc\xF3n",IDAC:"Id\xE1c",IMAC:"Im\xE1c",ITERACRE:"Iter\xE1cre",DEPASA:"Dep\xE1sa",SANEACRE:"Sane\xE1cre",DERACRE:"Der\xE1cre",RBTRANS:"Erre B\xEA Tr\xE2ns",FEM:"F\xE9m",FGB:"Funda\xE7\xE3o Garibaldi Brasil",FUNDHACRE:"Fund\xE1cre",HEMOACRE:"Emo\xE1cre",INTO:"\xCDnto",HUERB:"U\xE9rb",MATER:"M\xE1ter",SAS:"S\xE1s",CRAS:"Cr\xE1s",CREAS:"Cr\xEAas",CAPS:"C\xE1ps","RIO BRANCO":"Rio Branco","CRUZEIRO DO SUL":"Cruzeiro do Sul","SENA MADUREIRA":"Sena Madureira",TARAUAC\u00C1:"Tarauac\xE1",FEIJ\u00D3:"Feij\xF3",BRASIL\u00C9IA:"Brasil\xE9ia",EPITACIOL\u00C2NDIA:"Epitaciol\xE2ndia",XAPURI:"Xapur\xED","PL\xC1CIDO DE CASTRO":"Pl\xE1cido de Castro","SENADOR GUIOMARD":"Senador Guiomard","MANOEL URBANO":"Manoel Urbano","ASSIS BRASIL":"Assis Brasil",CAPIXABA:"Capixaba",BUJARI:"Bujar\xED","PORTO ACRE":"Porto Acre",ACREL\u00C2NDIA:"Acrel\xE2ndia","RODRIGUES ALVES":"Rodrigues Alves","M\xC2NCIO LIMA":"M\xE2ncio Lima","PORTO WALTER":"Porto V\xE1lter","MARECHAL THAUMATURGO":"Marechal Taumaturgo",JORDAO:"Jord\xE3o",JORD\u00C3O:"Jord\xE3o","SANTA ROSA DO PURUS":"Santa Rosa do Pur\xFAs",QUINARI:"Quinar\xED"},R={"dr.":"doutor","dra.":"doutora","sr.":"senhor","sra.":"senhora","srta.":"senhorita","prof.":"professor","profa.":"professora","eng.":"engenheiro","enga.":"engenheira","arq.":"arquiteto","adv.":"advogado","gov.":"governador","pref.":"prefeito","dep.":"deputado","sen.":"senador","ver.":"vereador","sec.":"secret\xE1rio","pres.":"presidente","dir.":"diretor","coord.":"coordenador","av.":"avenida","r.":"rua","al.":"alameda","tv.":"travessa","p\xE7.":"pra\xE7a","pca.":"pra\xE7a","rod.":"rodovia","br-":"B\xEA Erre ","ac-":"A C\xEA ",km:"quil\xF4metros",m:"metros",cm:"cent\xEDmetros",mm:"mil\xEDmetros",kg:"quilos",g:"gramas",mg:"miligramas",l:"litros",ml:"mililitros",h:"horas",min:"minutos",seg:"segundos","tel.":"telefone","cel.":"celular",n\u00BA:"n\xFAmero","n.":"n\xFAmero","no.":"n\xFAmero","art.":"artigo","inc.":"inciso","par.":"par\xE1grafo","cap.":"cap\xEDtulo","p\xE1g.":"p\xE1gina","p.":"p\xE1gina","pp.":"p\xE1ginas","vol.":"volume","ed.":"edi\xE7\xE3o","obs.":"observa\xE7\xE3o","ex.":"exemplo","etc.":"etc\xE9tera","cia.":"companhia","ltda.":"limitada","s/a":"sociedade an\xF4nima","s.a.":"sociedade an\xF4nima","cpf:":"C\xEA P\xEA \xC9fe:","rg:":"Erre G\xEA:","cep:":"C\xEA \xC9 P\xEA:","cnpj:":"C\xEA Ene P\xEA Jota:"},g=class{siglas;abreviacoes;constructor(t){this.siglas={...A,...t?.customAcronyms||{}},this.abreviacoes={...R,...t?.customAbbreviations||{}}}normalize(t){if(!t)return"";let e=t;return e=e.replace(/[★■●○▪▸▹]/g," ").replace(/\s*[·•|]\s*/g,", ").replace(/[←→↑↓]/g," ").replace(/\s+/g," ").trim(),e=e.replace(/\b(\d{1,2})[xX](\d{1,2})\b/g,(i,s,r)=>`${this.numberToWords(parseInt(s,10))} por ${this.numberToWords(parseInt(r,10))}`),e=e.replace(/(\d+)\s*°\s*C\b/gi,(i,s)=>`${this.numberToWords(parseInt(s,10))} graus Celsius`),e=this.normalizeDates(e),e=this.normalizeCurrency(e),e=this.normalizePercentages(e),e=this.normalizePhonesAndCep(e),e=this.normalizeAbbreviations(e),e=this.normalizeAcronyms(e),e=this.normalizeOrdinals(e),e=this.normalizeRomanNumerals(e),e=this.normalizeNumbers(e),e=this.cleanUp(e),e}normalizeDates(t){return t.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/g,(e,i,s,r)=>{let n=parseInt(i,10),a=w[s],o=parseInt(r,10);if(o<100&&(o+=o>50?1900:2e3),n>=1&&n<=31&&a){let l=n===1?"primeiro":this.numberToWords(n),c=this.numberToWords(o);return`${l} de ${a} de ${c}`}return e})}normalizeCurrency(t){return t.replace(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:,\d{1,2})?)/g,(e,i)=>{let s=i.replace(/\./g,"").split(","),r=parseInt(s[0],10),n=s[1]?parseInt(s[1].padEnd(2,"0"),10):0,a="";return r>0&&(a+=`${this.numberToWords(r)} ${r===1?"real":"reais"}`),n>0&&(a&&(a+=" e "),a+=`${this.numberToWords(n)} ${n===1?"centavo":"centavos"}`),r===0&&n===0&&(a="zero reais"),a||e})}normalizePercentages(t){return t.replace(/(\d+(?:,\d+)?)\s*%/g,(e,i)=>{if(i.includes(",")){let[s,r]=i.split(",");return`${this.numberToWords(parseInt(s,10))} v\xEDrgula ${this.numberToWords(parseInt(r,10))} por cento`}return`${this.numberToWords(parseInt(i,10))} por cento`})}normalizePhonesAndCep(t){return t=t.replace(/\b(\d{5})-(\d{3})\b/g,(e,i,s)=>`${this.digitsToWords(i)} tra\xE7o ${this.digitsToWords(s)}`),t=t.replace(/(?:\((\d{2})\)\s*)?(\d{4,5})-(\d{4})\b/g,(e,i,s,r)=>{let n="";return i&&(n+=`D\xEA D\xEA D\xEA ${this.digitsToWords(i)}, `),n+=`${this.digitsToWords(s)} ${this.digitsToWords(r)}`,n}),t}normalizeAbbreviations(t){let e=t;for(let[i,s]of Object.entries(this.abreviacoes)){let r=i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n=new RegExp(`(?<=^|\\s|\\()${r}(?=\\s|$|[.,;:])`,"gi");e=e.replace(n,s)}return e}normalizeAcronyms(t){let e=t,i=Object.keys(this.siglas).sort((s,r)=>r.length-s.length);for(let s of i){let r=this.siglas[s],n=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a=new RegExp(`\\b${n}\\b`,"g");e=e.replace(a,r)}return e}normalizeOrdinals(t){let e={1:"primeiro",2:"segundo",3:"terceiro",4:"quarto",5:"quinto",6:"sexto",7:"s\xE9timo",8:"oitavo",9:"nono",10:"d\xE9cimo"},i={1:"primeira",2:"segunda",3:"terceira",4:"quarta",5:"quinta",6:"sexta",7:"s\xE9tima",8:"oitava",9:"nona",10:"d\xE9cima"};return t=t.replace(/\b(\d+)[º°]\b/g,(s,r)=>{let n=parseInt(r,10);return e[n]||s}),t=t.replace(/\b(\d+)ª\b/g,(s,r)=>{let n=parseInt(r,10);return i[n]||s}),t}normalizeRomanNumerals(t){let e={I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12,XIII:13,XIV:14,XV:15,XVI:16,XVII:17,XVIII:18,XIX:19,XX:20,XXI:21};return t.replace(/\b(Século|Capítulo|Artigo|Inciso|Volume|Tomo|Papa|Dom|Rei|João| Bento|Pio|Paulo)\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI)\b/gi,(i,s,r)=>{let n=e[r.toUpperCase()];if(!n)return i;let a=s.toLowerCase();return["artigo","inciso","cap\xEDtulo"].includes(a)&&n<=10?`${s} ${["","primeiro","segundo","terceiro","quarto","quinto","sexto","s\xE9timo","oitavo","nono","d\xE9cimo"][n]}`:`${s} ${this.numberToWords(n)}`})}normalizeNumbers(t){return t=t.replace(/\b\d{1,3}(?:\.\d{3})+\b/g,e=>{let i=parseInt(e.replace(/\./g,""),10);return!isNaN(i)&&i<=999999999?this.numberToWords(i):e}),t=t.replace(/\b(\d+),(\d+)\b/g,(e,i,s)=>{let r=parseInt(i,10),n=parseInt(s,10);return`${this.numberToWords(r)} v\xEDrgula ${this.numberToWords(n)}`}),t=t.replace(/\b\d+\b/g,e=>{if(e.length>1&&e.startsWith("0")){let s=parseInt(e,10);return e.length<=3&&!isNaN(s)?this.numberToWords(s):this.digitsToWords(e)}let i=parseInt(e,10);return!isNaN(i)&&i<=999999999?this.numberToWords(i):e}),t}digitsToWords(t){let e={0:"zero",1:"um",2:"dois",3:"tr\xEAs",4:"quatro",5:"cinco",6:"seis",7:"sete",8:"oito",9:"nove"};return t.split("").map(i=>e[i]||i).join(" ")}numberToWords(t){if(t===0)return"zero";if(t<0)return`menos ${this.numberToWords(Math.abs(t))}`;let e="";if(t>=1e6){let i=Math.floor(t/1e6);e+=`${this.convertHundreds(i)} ${i===1?"milh\xE3o":"milh\xF5es"}`,t%=1e6,t>0&&(e+=t<100||t%100===0?" e ":", ")}if(t>=1e3){let i=Math.floor(t/1e3);i===1?e+="mil":e+=`${this.convertHundreds(i)} mil`,t%=1e3,t>0&&(e+=t<100||t%100===0?" e ":", ")}return t>0&&(e+=this.convertHundreds(t)),e.trim()}convertHundreds(t){if(t===100)return"cem";let e="",i=Math.floor(t/100),s=Math.floor(t%100/10),r=t%10;return i>0&&(e+=C[i]),s===1?(e&&(e+=" e "),e+=S[r]):(s>1&&(e&&(e+=" e "),e+=k[s]),r>0&&(e&&(e+=" e "),e+=E[r])),e}cleanUp(t){return t.replace(/\s+/g," ").replace(/\s+([.,;:!?])/g,"$1").trim()}};var u={contentRoots:['[role="dialog"]',"main","article",'[role="main"]'],readableSelectors:["[data-readable-text]","h1","h2","h3","h4","p","blockquote","figcaption","li","summary"],ignoreSelectors:["capi-mascot","acre-accessibility-panel","nav","script","style","noscript",'[aria-hidden="true"]',".sr-only",'[data-paywall-locked="true"]',".select-none.pointer-events-none"],interactiveSelectors:["a","button","input","select","textarea","summary",'[role="button"]',"[data-lightbox-trigger]"],readableTextAttr:"data-readable-text",directSpeakAttr:"data-acre-speak"},m=class{synth=null;voices=[];selectedVoice=null;normalizer;callbacks;structure;isReading=!1;isPaused=!1;rate=1.05;pitch=1;readableElements=[];currentIndex=0;currentHighlightedEl=null;readOnHover=!1;hoverTimeout=null;lastHoveredEl=null;serverTtsUrl="";currentAudio=null;useServerTts=!1;currentUtterance=null;watchdogTimer=null;subChunks=[];currentSubChunkIndex=0;activeSessionId=0;isProgrammaticScroll=!1;lastUserMouseMoveTime=0;consecutiveErrors=0;consecutiveInstantSkips=0;constructor(t={},e={}){this.callbacks=t,this.structure={contentRoots:e.contentRoots?.length?e.contentRoots:u.contentRoots,readableSelectors:e.readableSelectors?.length?e.readableSelectors:u.readableSelectors,ignoreSelectors:e.ignoreSelectors?.length?e.ignoreSelectors:u.ignoreSelectors,interactiveSelectors:e.interactiveSelectors?.length?e.interactiveSelectors:u.interactiveSelectors,readableTextAttr:e.readableTextAttr||u.readableTextAttr,directSpeakAttr:e.directSpeakAttr||u.directSpeakAttr},this.normalizer=new g({customAcronyms:e.customAcronyms}),typeof window<"u"&&"speechSynthesis"in window&&(this.synth=window.speechSynthesis,this.initVoices(),this.setupHoverReading(),this.setupClickToRead()),e.backendUrl&&(this.serverTtsUrl=`${e.backendUrl.replace(/\/$/,"")}/api/tts`,this.useServerTts=!0)}initVoices(){if(!this.synth)return;let t=()=>{this.synth&&(this.voices=this.synth.getVoices(),this.voices.length>0&&!this.selectedVoice&&(this.selectedVoice=this.pickBestPortugueseVoice(this.voices)))};t(),typeof window<"u"&&this.synth.onvoiceschanged!==void 0&&(this.synth.onvoiceschanged=t)}pickBestPortugueseVoice(t){let e=t.filter(n=>n.lang.toLowerCase().includes("pt-br")||n.lang.toLowerCase().includes("pt_br")||n.lang.toLowerCase().startsWith("pt"));if(e.length===0)return t[0]||null;let i=["natural","francisca","antonio","thalita","neural","online","google portugu\xEAs do brasil","google","luciana","daniel","microsoft","premium","enhanced","brasil","brazil"],s=e[0],r=-1;for(let n of e){let a=0,o=n.name.toLowerCase();n.lang.toLowerCase().includes("br")&&(a+=20);for(let c=0;c<i.length;c++)o.includes(i[c])&&(a+=(i.length-c)*5);n.localService||(a+=10),a>r&&(r=a,s=n)}return s}getAvailablePortugueseVoices(){return this.voices.filter(t=>t.lang.toLowerCase().startsWith("pt"))}setVoiceByName(t){let e=this.voices.find(i=>i.name===t);e&&(this.selectedVoice=e,this.useServerTts=!1)}setRate(t){this.rate=Math.max(.5,Math.min(2.2,t)),this.currentAudio&&(this.currentAudio.playbackRate=this.rate)}getRate(){return this.rate}setReadOnHover(t){this.readOnHover=t,t||this.clearHighlight()}isReadOnHoverEnabled(){return this.readOnHover}onRouteChange(){this.isReading||this.isPaused?this.stop():this.clearHighlight(),this.readableElements=[],this.currentIndex=0}isIgnoredElement(t){if(!t)return!0;let e=this.structure.ignoreSelectors.join(", ");if(!e)return!1;try{return!!(t.matches(e)||t.closest(e))}catch{return!1}}resolveRootContainers(){if(typeof document>"u")return[];for(let t of this.structure.contentRoots)try{let e=Array.from(document.querySelectorAll(t)).filter(i=>{let s=window.getComputedStyle(i);return s.display!=="none"&&s.visibility!=="hidden"});if(e.length>0)return e}catch{}return[document.body]}scanReadableElements(){if(typeof document>"u")return[];let t=this.structure.readableSelectors.join(", "),e=this.resolveRootContainers(),i=[];for(let n of e)n.querySelectorAll(t).forEach(o=>{i.includes(o)||i.push(o)});let s=i.filter(n=>{if(this.isIgnoredElement(n))return!1;let a=window.getComputedStyle(n);if(a.display==="none"||a.visibility==="hidden"||a.opacity==="0")return!1;let o=n.getBoundingClientRect();return o.width===0||o.height===0?!1:this.extractCleanText(n).length>2}),r=s.filter(n=>{if(n.getAttribute(this.structure.readableTextAttr))return!0;let o=n.parentElement?.closest(`[${this.structure.readableTextAttr}]`);return o&&s.includes(o)?!1:!s.some(c=>c!==n&&n.contains(c))});return this.readableElements=r,r}extractCleanText(t){let e=t.getAttribute(this.structure.readableTextAttr);if(e&&e.trim().length>0)return e.trim();let i=t.cloneNode(!0);return i.querySelectorAll('[aria-hidden="true"], .sr-only, script, style, svg').forEach(s=>s.remove()),(i.innerText||i.textContent||"").replace(/\s+/g," ").trim()}splitIntoSentences(t){let e=this.normalizer.normalize(t);if(e.length<=180)return[e];let i=e.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[e],s=[],r="";for(let n of i){let a=n.trim();if(a)if((r+" "+a).trim().length<=200)r=(r+" "+a).trim();else if(r&&s.push(r),a.length>220){let o=a.split(/,\s*/),l="";for(let c of o)(l+", "+c).length<=200?l=l?`${l}, ${c}`:c:(l&&s.push(l),l=c);r=l}else r=a}return r&&s.push(r),s.length>0?s:[e]}startPageReading(t=!0){if(!(!this.synth&&!this.useServerTts)){if(this.cancelCurrentSpeechOnly(),this.consecutiveErrors=0,(t||this.readableElements.length===0)&&(this.scanReadableElements(),this.currentIndex=0),this.readableElements.length===0){this.speakDirectText("N\xE3o encontramos textos leg\xEDveis nesta se\xE7\xE3o.");return}this.isReading=!0,this.isPaused=!1,this.activeSessionId++,this.callbacks.onStart?.(),this.readCurrentElement(this.activeSessionId)}}readCurrentElement(t){if(!this.isReading||t!==this.activeSessionId)return;if(this.currentIndex>=this.readableElements.length){this.stop();return}let e=this.readableElements[this.currentIndex],i=this.extractCleanText(e);if(!i){this.currentIndex++,this.readCurrentElement(t);return}this.highlightElement(e,!0),this.callbacks.onSentenceChange?.(e,i),this.subChunks=this.splitIntoSentences(i),this.currentSubChunkIndex=0,this.speakNextSubChunk(t)}speakNextSubChunk(t){if(!this.isReading||t!==this.activeSessionId)return;if(this.currentSubChunkIndex>=this.subChunks.length){this.currentIndex++,window.setTimeout(()=>{this.isReading&&!this.isPaused&&t===this.activeSessionId&&this.readCurrentElement(t)},350);return}let e=this.subChunks[this.currentSubChunkIndex];this.speakRawChunk(e,t,()=>{this.isReading&&!this.isPaused&&t===this.activeSessionId&&(this.currentSubChunkIndex++,this.speakNextSubChunk(t))})}readSingleElement(t){let e=this.extractCleanText(t);if(!e)return;this.cancelCurrentSpeechOnly(),this.isReading=!0,this.isPaused=!1,this.activeSessionId++;let i=this.activeSessionId;this.highlightElement(t,!1),this.callbacks.onStart?.(),this.callbacks.onSentenceChange?.(t,e),this.subChunks=this.splitIntoSentences(e),this.currentSubChunkIndex=0;let s=()=>{if(!this.isReading||i!==this.activeSessionId)return;if(this.currentSubChunkIndex>=this.subChunks.length){this.isReading=!1,this.clearHighlight(),this.callbacks.onStop?.();return}let r=this.subChunks[this.currentSubChunkIndex];this.speakRawChunk(r,i,()=>{this.isReading&&!this.isPaused&&i===this.activeSessionId&&(this.currentSubChunkIndex++,s())})};s()}speakDirectText(t){this.cancelCurrentSpeechOnly(),this.isReading=!0,this.isPaused=!1,this.activeSessionId++;let e=this.activeSessionId;this.callbacks.onStart?.(),this.callbacks.onSentenceChange?.(null,t),this.subChunks=this.splitIntoSentences(t),this.currentSubChunkIndex=0;let i=()=>{if(!this.isReading||e!==this.activeSessionId)return;if(this.currentSubChunkIndex>=this.subChunks.length){this.isReading=!1,this.callbacks.onStop?.();return}let s=this.subChunks[this.currentSubChunkIndex];this.speakRawChunk(s,e,()=>{this.isReading&&!this.isPaused&&e===this.activeSessionId&&(this.currentSubChunkIndex++,i())})};i()}speakRawChunk(t,e,i){if(this.clearWatchdog(),this.useServerTts&&this.serverTtsUrl){this.fetchAndPlayServerAudio(t,e,i);return}if(!this.synth){i();return}let s=t.trim();if(!s||s.length<2){i();return}this.voices.length===0&&(this.voices=this.synth.getVoices(),this.voices.length>0&&!this.selectedVoice&&(this.selectedVoice=this.pickBestPortugueseVoice(this.voices)));let r=new SpeechSynthesisUtterance(s);r.lang=this.selectedVoice?.lang||"pt-BR",r.rate=this.rate,r.pitch=this.pitch,this.selectedVoice&&(r.voice=this.selectedVoice),this.currentUtterance=r,window.__acreActiveUtterance=r;let n=!1,a=Date.now(),o=()=>{n||(n=!0,this.clearWatchdog(),e===this.activeSessionId&&i())};r.onstart=()=>{this.consecutiveErrors=0},r.onend=()=>{let c=Date.now()-a;if(s.length>=12&&c<200){if(this.consecutiveInstantSkips++,this.consecutiveInstantSkips>=3){console.warn("[VoiceReader] S\xEDntese de voz finalizou instantaneamente repetidas vezes. Encerrando leitura para evitar pulos."),this.stop();return}}else this.consecutiveInstantSkips=0;this.consecutiveErrors=0,o()},r.onerror=c=>{if(c.error==="interrupted"||c.error==="canceled"){this.clearWatchdog();return}console.warn(`[VoiceReader] Erro na s\xEDntese Web Speech (${c.error}).`);let y=["synthesis-failed","language-unavailable","network","audio-busy","voice-unavailable"];if((!c.error||y.includes(c.error))&&this.serverTtsUrl){console.warn("\u{1F9AB} Chaveando para servidor TTS neural ap\xF3s falha no Web Speech local."),this.useServerTts=!0,this.clearWatchdog(),this.fetchAndPlayServerAudio(s,e,i);return}if(this.consecutiveErrors++,this.consecutiveErrors>=2){console.warn("[VoiceReader] S\xEDntese de voz bloqueada ou sem suporte no sistema operacional. Encerrando leitura."),this.callbacks.onSentenceChange?.(null,"S\xEDntese de voz indispon\xEDvel ou sem suporte neste navegador."),this.stop();return}this.selectedVoice=null,window.setTimeout(()=>o(),400)};let l=Math.max(5e3,s.length*110/this.rate+3e3);this.watchdogTimer=window.setTimeout(()=>{!n&&this.isReading&&!this.isPaused&&e===this.activeSessionId&&o()},l);try{this.synth.paused&&this.synth.resume(),this.synth.speak(r)}catch{this.consecutiveErrors++,this.consecutiveErrors>=3?this.stop():window.setTimeout(()=>o(),400)}}clearWatchdog(){this.watchdogTimer!==null&&(clearTimeout(this.watchdogTimer),this.watchdogTimer=null)}async fetchAndPlayServerAudio(t,e,i){try{let s=await fetch(this.serverTtsUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t})});if(!s.ok)throw new Error(`HTTP ${s.status}`);if(e!==this.activeSessionId||!this.isReading)return;let r=await s.blob(),n=URL.createObjectURL(r);this.currentAudio&&(this.currentAudio.pause(),this.currentAudio=null);let a=new Audio(n);a.playbackRate=this.rate,this.currentAudio=a,a.onended=()=>{URL.revokeObjectURL(n),e===this.activeSessionId&&i()},a.onerror=()=>{URL.revokeObjectURL(n),console.warn("[VoiceReader] Erro ao reproduzir \xE1udio do servidor TTS."),this.callbacks.onSentenceChange?.(null,"Erro ao reproduzir \xE1udio do servidor de voz."),this.stop()},await a.play()}catch(s){console.warn("[VoiceReader] Falha na requisi\xE7\xE3o ao servidor TTS:",s),this.callbacks.onSentenceChange?.(null,"Servidor de voz offline ou indispon\xEDvel."),this.stop()}}cancelCurrentSpeechOnly(){if(this.clearWatchdog(),this.currentUtterance=null,delete window.__acreActiveUtterance,this.currentAudio&&(this.currentAudio.pause(),this.currentAudio=null),this.synth)try{this.synth.cancel()}catch{}}pause(){if(!(!this.isReading||this.isPaused)){if(this.isPaused=!0,this.clearWatchdog(),this.currentAudio)this.currentAudio.pause();else if(this.synth)try{this.synth.pause()}catch{}this.callbacks.onPause?.()}}resume(){if(!(!this.isReading||!this.isPaused)){if(this.isPaused=!1,this.currentAudio)this.currentAudio.play();else if(this.synth)try{this.synth.resume()}catch{}this.callbacks.onResume?.()}}stop(){this.activeSessionId++,this.isReading=!1,this.isPaused=!1,this.subChunks=[],this.currentSubChunkIndex=0,this.currentIndex=0,this.consecutiveErrors=0,this.cancelCurrentSpeechOnly(),this.clearHighlight(),this.callbacks.onStop?.()}nextElement(){this.readableElements.length===0&&this.scanReadableElements(),this.currentIndex<this.readableElements.length-1&&(this.cancelCurrentSpeechOnly(),this.currentIndex++,this.isReading=!0,this.isPaused=!1,this.activeSessionId++,this.callbacks.onStart?.(),this.readCurrentElement(this.activeSessionId))}previousElement(){this.readableElements.length===0&&this.scanReadableElements(),this.currentIndex>0&&(this.cancelCurrentSpeechOnly(),this.currentIndex--,this.isReading=!0,this.isPaused=!1,this.activeSessionId++,this.callbacks.onStart?.(),this.readCurrentElement(this.activeSessionId))}getStatus(){return{isReading:this.isReading,isPaused:this.isPaused,currentIndex:this.currentIndex,totalElements:this.readableElements.length}}highlightElement(t,e=!1){if(this.clearHighlight(),this.currentHighlightedEl=t,t.classList.add("acre-acessivel-reading-highlight"),!e)return;let i=t.getBoundingClientRect(),s=window.innerHeight||document.documentElement.clientHeight;i.top>=60&&i.bottom<=s-60||(this.isProgrammaticScroll=!0,t.scrollIntoView({behavior:"smooth",block:"nearest"}),window.setTimeout(()=>{this.isProgrammaticScroll=!1},500))}clearHighlight(){this.currentHighlightedEl&&(this.currentHighlightedEl.classList.remove("acre-acessivel-reading-highlight"),this.currentHighlightedEl=null)}setupHoverReading(){if(typeof document>"u")return;document.addEventListener("mousemove",()=>{this.lastUserMouseMoveTime=Date.now()},{passive:!0});let t=[...this.structure.readableSelectors,"button","a","label"].join(", ");document.addEventListener("mouseover",e=>{if(!this.readOnHover||this.isReading||this.isProgrammaticScroll||Date.now()-this.lastUserMouseMoveTime>400)return;let i=e.target;if(!i||this.isIgnoredElement(i))return;let s=i.closest(t);!s||s===this.lastHoveredEl||this.isIgnoredElement(s)||(this.hoverTimeout&&window.clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>{if(!this.readOnHover||this.isReading||this.isProgrammaticScroll)return;let r=this.extractCleanText(s);r&&r.length>1&&(this.lastHoveredEl=s,this.readSingleElement(s))},350))})}setupClickToRead(){if(typeof document>"u")return;let t=this.structure.directSpeakAttr,e=this.structure.interactiveSelectors.join(", "),i=this.structure.readableSelectors.join(", ");document.addEventListener("click",s=>{let r=s.target;if(!r)return;let n=r.closest(`[${t}]`);if(n){let l=n.getAttribute(t);if(l&&l.trim()){s.stopPropagation(),this.speakDirectText(l.trim());return}}if(!this.readOnHover||this.isIgnoredElement(r)||e&&r.closest(e))return;let a=window.getSelection();if(a&&a.toString().trim().length>0)return;let o=r.closest(i);if(o&&!this.isIgnoredElement(o)){let l=this.extractCleanText(o);l&&l.length>2&&this.readSingleElement(o)}})}};var b=class{mascot=null;panel=null;voiceReader=null;initialized=!1;init(t={}){if(typeof window>"u"||typeof document>"u"||this.initialized)return;this.initialized=!0,f(),v();let e=()=>{this.mountComponents(t)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e()}mountComponents(t){if(document.querySelector("capi-mascot"))return;let e=document.createElement("capi-mascot"),i=document.createElement("acre-accessibility-panel");t.position==="bottom-left"&&(e.style.right="auto",e.style.left="24px",i.style.right="auto",i.style.left="24px");let s=r=>{e.setAttribute("state",r)};this.voiceReader=new m({onStart:()=>{s("speaking"),i.updateReadingStatus(!0,!1)},onStop:()=>{s("idle"),i.updateReadingStatus(!1,!1)},onPause:()=>{s("idle"),i.updateReadingStatus(!0,!0)},onResume:()=>{s("speaking"),i.updateReadingStatus(!0,!1)},onSentenceChange:(r,n)=>{i.updateReadingStatus(!0,!1,n)}},{...t.reader,backendUrl:t.backendUrl??t.reader?.backendUrl}),i.setVoiceReader(this.voiceReader),e.addEventListener("toggle-panel",()=>{i.toggle()}),document.body.appendChild(i),document.body.appendChild(e),this.mascot=e,this.panel=i}speak(t){this.voiceReader?.speakDirectText(t)}stop(){this.voiceReader?.stop()}openPanel(){this.panel?.toggle(!0)}closePanel(){this.panel?.toggle(!1)}onRouteChange(){this.voiceReader?.onRouteChange()}},x=new b;typeof window<"u"&&(window.AcreAcessivel=x);var z=x;})();
