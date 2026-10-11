import './capi-mascot';
import './accessibility-panel';

export interface AcreAcessivelConfig {
  leitura?: boolean;
  contraste?: boolean;
  fonte?: boolean;
  audio?: boolean;
  libras?: boolean; // Preparação para integração com VLibras ou outros
}

class AcreAcessivelInitializer {
  private panelInstance: HTMLElement | null = null;

  /** Referência pública ao painel para integração com scripts externos (BarraAcessibilidade, etc.) */
  public get panel(): any {
    return this.panelInstance;
  }

  public get reader(): any {
    return (this.panelInstance as any)?.reader || null;
  }

  public setLanguage(lang: string) {
    if (this.panelInstance && typeof (this.panelInstance as any).setLanguage === 'function') {
      (this.panelInstance as any).setLanguage(lang);
    } else if (this.reader && typeof this.reader.setLanguage === 'function') {
      this.reader.setLanguage(lang);
    }
  }

  public readBlocks(
    blocks: { id?: string; elementId?: string; text: string }[],
    startIndex: number = 0,
    onBlockStart?: (idx: number, block: any) => void,
    onComplete?: () => void
  ) {
    if (this.reader && typeof this.reader.readBlocks === 'function') {
      return this.reader.readBlocks(blocks, startIndex, onBlockStart, onComplete);
    }
  }

  public stop() {
    if (this.reader && typeof this.reader.stop === 'function') {
      this.reader.stop();
    }
  }

  public pause() {
    if (this.reader && typeof this.reader.pause === 'function') {
      this.reader.pause();
    }
  }

  public resume() {
    if (this.reader && typeof this.reader.resume === 'function') {
      this.reader.resume();
    }
  }

  public init(config: AcreAcessivelConfig = {}) {
    // Garante que o inicializador rode no navegador
    if (typeof window === 'undefined') return;

    // Evita duplicidade
    if (document.querySelector('acre-accessibility-panel')) {
      console.warn('Acre Acessível já inicializado nesta página.');
      return;
    }

    // Cria a instância do Web Component do painel
    this.panelInstance = document.createElement('acre-accessibility-panel');
    
    // Passa configurações para atributos se necessário
    if (config.libras) {
      this.injectVLibras();
    }

    // Anexa o componente ao body
    document.body.appendChild(this.panelInstance);

    console.log('[Acre Acessivel] Inicializado com sucesso. Mascote Capi pronto para ajudar.');
  }

  /**
   * Integração opcional com o VLibras do Governo Federal
   */
  private injectVLibras() {
    if (document.getElementById('vlibras-div')) return;

    // Cria a div necessária para o VLibras
    const vlibrasDiv = document.createElement('div');
    vlibrasDiv.id = 'vlibras-div';
    vlibrasDiv.setAttribute('vw', '');
    vlibrasDiv.classList.add('enabled');
    vlibrasDiv.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(vlibrasDiv);

    // Carrega o script do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
      // @ts-ignore
      new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.head.appendChild(script);
  }
}

// Expõe globalmente
const AcreAcessivel = new AcreAcessivelInitializer();
// @ts-ignore
window.AcreAcessivel = AcreAcessivel;

export default AcreAcessivel;
