/**
 * TextNormalizer - Normalização de texto para TTS em Português Brasileiro (PT-BR)
 * Converte números, datas, siglas, moeda, temperaturas e abreviações para forma extensiva falada.
 * Zero hardcode de domínio: aceita dicionário de siglas e substituições via configuração.
 */

const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const DEZ_A_DEZENOVE = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

const MESES: Record<string, string> = {
  '01': 'janeiro', '1': 'janeiro',
  '02': 'fevereiro', '2': 'fevereiro',
  '03': 'março', '3': 'março',
  '04': 'abril', '4': 'abril',
  '05': 'maio', '5': 'maio',
  '06': 'junho', '6': 'junho',
  '07': 'julho', '7': 'julho',
  '08': 'agosto', '8': 'agosto',
  '09': 'setembro', '9': 'setembro',
  '10': 'outubro',
  '11': 'novembro',
  '12': 'dezembro',
};

const DEFAULT_SIGLAS: Record<string, string> = {
  'AC': 'Acre',
  'UFAC': 'Ufac',
  'SEFAZ': 'Sefaz',
  'DETRAN': 'Detran',
  'SESACRE': 'Sesacre',
  'SEE': 'Secretaria de Educação',
  'SEJUSP': 'Sejusp',
  'MPAC': 'Ministério Público do Acre',
  'TJAC': 'Tribunal de Justiça do Acre',
  'ALEAC': 'Assembleia Legislativa do Acre',
  'GOV': 'Governo',
  'CPF': 'Cê Pê Éfe',
  'RG': 'Erre Gê',
  'CNPJ': 'Cê Ene Pê Jota',
  'CEP': 'Cê É Pê',
  'SUS': 'Sús',
  'INSS': 'I Ene Ésse Ésse',
  'IBGE': 'I Bê Gê É',
  'ONU': 'Ônu',
  'MEC': 'Méc',
  'ENEM': 'Enem',
  'PIX': 'Píx',
  'PDF': 'Pê Dê Éfe',
  'URL': 'U Erre Éle',
  'HTML': 'Agá Tê Eme Éle',
  'CSS': 'Cê Ésse Ésse',
  'API': 'A Pê I',
  'TTS': 'Texto para Fala',
  'WCAG': 'Dáblio Cê A Gê',
  'EMAG': 'ê-Mág',
  'COVID': 'Covíd',
  'UTI': 'U Tê I',
  'UBS': 'U Bê Ésse',
  'UPA': 'Úpa',
  'SAMU': 'Samú',
  'PM': 'Polícia Militar',
  'PC': 'Polícia Civil',
  'BM': 'Bombeiros Militares',
  'BO': 'Boletim de Ocorrência',
  'CNH': 'Cê Ene Agá',
  'IPVA': 'I Pê Vê A',
  'ICMS': 'I Cê Eme Ésse',
  'IPTU': 'I Pê Tê U',
  'FGTS': 'Éfe Gê Tê Ésse',
  'CLT': 'Cê Éle Tê',
  'MEI': 'Mêi',
  'PME': 'Pê Eme É',
  'SEBRAE': 'Sebráe',
  'SENAC': 'Senác',
  'SENAI': 'Senái',
  'SESC': 'Sésc',
  'SESI': 'Sési',
  'OAB': 'Ó A Bê',
  'CRM': 'Cê Erre Eme',
  'CREA': 'Crêa',
  'CAU': 'Cáu',
  'CRP': 'Cê Erre Pê',
  'COREN': 'Corén',
  'CRO': 'Cê Erre Ó',
  'CRF': 'Cê Erre Éfe',
  'CREF': 'Créfe',
  'CRESS': 'Créss',
  'CONFEA': 'Confêa',
  'IBAMA': 'Ibama',
  'ICMBIO': 'I Cê Eme Bio',
  'FUNAI': 'Funái',
  'INCRA': 'Íncra',
  'DNIT': 'Dênit',
  'ANATEL': 'Anatél',
  'ANEEL': 'Anéel',
  'ANP': 'A Ene Pê',
  'ANVISA': 'Anvísa',
  'ANS': 'A Ene Ésse',
  'ANA': 'Âna',
  'ANTAQ': 'Antáq',
  'ANTT': 'A Ene Tê Tê',
  'ANAC': 'Anác',
  'INFRAERO': 'Infraéro',
  'CORREIOS': 'Corrêios',
  'CAIXA': 'Cáixa',
  'BB': 'Banco do Brasil',
  'BASA': 'Bása',
  'BNDES': 'Bê Ene Dê Ésse',
  'BACEN': 'Bacén',
  'CVM': 'Cê Vê Eme',
  'STF': 'Ésse Tê Éfe',
  'STJ': 'Ésse Tê Jota',
  'TST': 'Tê Ésse Tê',
  'TSE': 'Tê Ésse É',
  'STM': 'Ésse Tê Eme',
  'CNJ': 'Cê Ene Jota',
  'CNMP': 'Cê Ene Eme Pê',
  'AGU': 'A Gê U',
  'PF': 'Polícia Federal',
  'PRF': 'Polícia Rodoviária Federal',
  'ABIN': 'Abín',
  'GSI': 'Gê Ésse I',
  'MD': 'Ministério da Defesa',
  'MRE': 'Itamaraty',
  'MF': 'Ministério da Fazenda',
  'MP': 'Ministério Público',
  'MJ': 'Ministério da Justiça',
  'MS': 'Ministério da Saúde',
  'MT': 'Ministério do Trabalho',
  'MMA': 'Ministério do Meio Ambiente',
  'MCTI': 'Eme Cê Tê I',
  'MINC': 'Mínc',
  'ME': 'Ministério da Economia',
  'MAPA': 'Mápa',
  'MDR': 'Eme Dê Erre',
  'MMFDH': 'Direitos Humanos',
  'CGU': 'Cê Gê U',
  'TCU': 'Tê Cê U',
  'TCE': 'Tê Cê É',
  'MPC': 'Eme Pê Cê',
  'PGE': 'Pê Gê É',
  'PGM': 'Pê Gê Eme',
  'DPE': 'Defensoria Pública',
  'DPU': 'Defensoria Pública da União',
  'PROCON': 'Procón',
  'IDAC': 'Idác',
  'IMAC': 'Imác',
  'ITERACRE': 'Iterácre',
  'DEPASA': 'Depása',
  'SANEACRE': 'Saneácre',
  'DERACRE': 'Derácre',
  'RBTRANS': 'Erre Bê Trâns',
  'FEM': 'Fém',
  'FGB': 'Fundação Garibaldi Brasil',
  'FUNDHACRE': 'Fundácre',
  'HEMOACRE': 'Emoácre',
  'INTO': 'Ínto',
  'HUERB': 'Uérb',
  'MATER': 'Máter',
  'SAS': 'Sás',
  'CRAS': 'Crás',
  'CREAS': 'Crêas',
  'CAPS': 'Cáps',
  'RIO BRANCO': 'Rio Branco',
  'CRUZEIRO DO SUL': 'Cruzeiro do Sul',
  'SENA MADUREIRA': 'Sena Madureira',
  'TARAUACÁ': 'Tarauacá',
  'FEIJÓ': 'Feijó',
  'BRASILÉIA': 'Brasiléia',
  'EPITACIOLÂNDIA': 'Epitaciolândia',
  'XAPURI': 'Xapurí',
  'PLÁCIDO DE CASTRO': 'Plácido de Castro',
  'SENADOR GUIOMARD': 'Senador Guiomard',
  'MANOEL URBANO': 'Manoel Urbano',
  'ASSIS BRASIL': 'Assis Brasil',
  'CAPIXABA': 'Capixaba',
  'BUJARI': 'Bujarí',
  'PORTO ACRE': 'Porto Acre',
  'ACRELÂNDIA': 'Acrelândia',
  'RODRIGUES ALVES': 'Rodrigues Alves',
  'MÂNCIO LIMA': 'Mâncio Lima',
  'PORTO WALTER': 'Porto Válter',
  'MARECHAL THAUMATURGO': 'Marechal Taumaturgo',
  'JORDAO': 'Jordão',
  'JORDÃO': 'Jordão',
  'SANTA ROSA DO PURUS': 'Santa Rosa do Purús',
  'QUINARI': 'Quinarí',
};

const ABREVIACOES: Record<string, string> = {
  'dr.': 'doutor',
  'dra.': 'doutora',
  'sr.': 'senhor',
  'sra.': 'senhora',
  'srta.': 'senhorita',
  'prof.': 'professor',
  'profa.': 'professora',
  'eng.': 'engenheiro',
  'enga.': 'engenheira',
  'arq.': 'arquiteto',
  'adv.': 'advogado',
  'gov.': 'governador',
  'pref.': 'prefeito',
  'dep.': 'deputado',
  'sen.': 'senador',
  'ver.': 'vereador',
  'sec.': 'secretário',
  'pres.': 'presidente',
  'dir.': 'diretor',
  'coord.': 'coordenador',
  'av.': 'avenida',
  'r.': 'rua',
  'al.': 'alameda',
  'tv.': 'travessa',
  'pç.': 'praça',
  'pca.': 'praça',
  'rod.': 'rodovia',
  'br-': 'Bê Erre ',
  'ac-': 'A Cê ',
  'km': 'quilômetros',
  'm': 'metros',
  'cm': 'centímetros',
  'mm': 'milímetros',
  'kg': 'quilos',
  'g': 'gramas',
  'mg': 'miligramas',
  'l': 'litros',
  'ml': 'mililitros',
  'h': 'horas',
  'min': 'minutos',
  'seg': 'segundos',
  'tel.': 'telefone',
  'cel.': 'celular',
  'nº': 'número',
  'n.': 'número',
  'no.': 'número',
  'art.': 'artigo',
  'inc.': 'inciso',
  'par.': 'parágrafo',
  'cap.': 'capítulo',
  'pág.': 'página',
  'p.': 'página',
  'pp.': 'páginas',
  'vol.': 'volume',
  'ed.': 'edição',
  'obs.': 'observação',
  'ex.': 'exemplo',
  'etc.': 'etcétera',
  'cia.': 'companhia',
  'ltda.': 'limitada',
  's/a': 'sociedade anônima',
  's.a.': 'sociedade anônima',
  'cpf:': 'Cê Pê Éfe:',
  'rg:': 'Erre Gê:',
  'cep:': 'Cê É Pê:',
  'cnpj:': 'Cê Ene Pê Jota:',
};

export interface TextNormalizerOptions {
  customAcronyms?: Record<string, string>;
  customAbbreviations?: Record<string, string>;
}

export class TextNormalizer {
  private siglas: Record<string, string>;
  private abreviacoes: Record<string, string>;

  constructor(options?: TextNormalizerOptions) {
    this.siglas = { ...DEFAULT_SIGLAS, ...(options?.customAcronyms || {}) };
    this.abreviacoes = { ...ABREVIACOES, ...(options?.customAbbreviations || {}) };
  }

  public normalize(text: string): string {
    if (!text) return '';

    let normalized = text;

    // 0. Limpar símbolos gráficos editoriais para leitura fluida
    normalized = normalized
      .replace(/[★■●○▪▸▹]/g, ' ')
      .replace(/\s*[·•|]\s*/g, ', ')
      .replace(/[←→↑↓]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Escalas de trabalho como 6x1, 0x7, 12x36
    normalized = normalized.replace(/\b(\d{1,2})[xX](\d{1,2})\b/g, (_, a, b) => {
      return `${this.numberToWords(parseInt(a, 10))} por ${this.numberToWords(parseInt(b, 10))}`;
    });

    // 2. Temperaturas (ex: 38°C, 38 °C)
    normalized = normalized.replace(/(\d+)\s*°\s*C\b/gi, (_, num) => {
      return `${this.numberToWords(parseInt(num, 10))} graus Celsius`;
    });

    // 3. Datas (DD/MM/YYYY ou DD/MM/YY)
    normalized = this.normalizeDates(normalized);

    // 4. Valores monetários (R$ 1.234,56)
    normalized = this.normalizeCurrency(normalized);

    // 5. Porcentagens (50%, 12,5%)
    normalized = this.normalizePercentages(normalized);

    // 6. Telefones e CEP
    normalized = this.normalizePhonesAndCep(normalized);

    // 7. Abreviações comuns
    normalized = this.normalizeAbbreviations(normalized);

    // 8. Siglas e Acrônimos
    normalized = this.normalizeAcronyms(normalized);

    // 9. Números ordinais (1º, 2ª)
    normalized = this.normalizeOrdinals(normalized);

    // 10. Algarismos Romanos em contextos comuns
    normalized = this.normalizeRomanNumerals(normalized);

    // 11. Números cardinais restantes
    normalized = this.normalizeNumbers(normalized);

    // 12. Limpeza de espaços extras e caracteres especiais soltos
    normalized = this.cleanUp(normalized);

    return normalized;
  }

  private normalizeDates(text: string): string {
    return text.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/g, (match, dia, mes, ano) => {
      const d = parseInt(dia, 10);
      const m = MESES[mes];
      let a = parseInt(ano, 10);
      if (a < 100) {
        a += a > 50 ? 1900 : 2000;
      }

      if (d >= 1 && d <= 31 && m) {
        const diaStr = d === 1 ? 'primeiro' : this.numberToWords(d);
        const anoStr = this.numberToWords(a);
        return `${diaStr} de ${m} de ${anoStr}`;
      }
      return match;
    });
  }

  private normalizeCurrency(text: string): string {
    return text.replace(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:,\d{1,2})?)/g, (match, valor) => {
      const parts = valor.replace(/\./g, '').split(',');
      const reais = parseInt(parts[0], 10);
      const centavos = parts[1] ? parseInt(parts[1].padEnd(2, '0'), 10) : 0;

      let result = '';
      if (reais > 0) {
        result += `${this.numberToWords(reais)} ${reais === 1 ? 'real' : 'reais'}`;
      }
      if (centavos > 0) {
        if (result) result += ' e ';
        result += `${this.numberToWords(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`;
      }
      if (reais === 0 && centavos === 0) {
        result = 'zero reais';
      }
      return result || match;
    });
  }

  private normalizePercentages(text: string): string {
    return text.replace(/(\d+(?:,\d+)?)\s*%/g, (_, num) => {
      if (num.includes(',')) {
        const [intPart, decPart] = num.split(',');
        return `${this.numberToWords(parseInt(intPart, 10))} vírgula ${this.numberToWords(parseInt(decPart, 10))} por cento`;
      }
      return `${this.numberToWords(parseInt(num, 10))} por cento`;
    });
  }

  private normalizePhonesAndCep(text: string): string {
    text = text.replace(/\b(\d{5})-(\d{3})\b/g, (_, p1, p2) => {
      return `${this.digitsToWords(p1)} traço ${this.digitsToWords(p2)}`;
    });

    text = text.replace(/(?:\((\d{2})\)\s*)?(\d{4,5})-(\d{4})\b/g, (_, ddd, p1, p2) => {
      let res = '';
      if (ddd) {
        res += `Dê Dê Dê ${this.digitsToWords(ddd)}, `;
      }
      res += `${this.digitsToWords(p1)} ${this.digitsToWords(p2)}`;
      return res;
    });

    return text;
  }

  private normalizeAbbreviations(text: string): string {
    let result = text;
    for (const [abrev, full] of Object.entries(this.abreviacoes)) {
      const escaped = abrev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<=^|\\s|\\()${escaped}(?=\\s|$|[.,;:])`, 'gi');
      result = result.replace(regex, full);
    }
    return result;
  }

  private normalizeAcronyms(text: string): string {
    let result = text;
    const sortedKeys = Object.keys(this.siglas).sort((a, b) => b.length - a.length);

    for (const sigla of sortedKeys) {
      const pronunciation = this.siglas[sigla];
      const escaped = sigla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'g');
      result = result.replace(regex, pronunciation);
    }

    return result;
  }

  private normalizeOrdinals(text: string): string {
    const ordinaisMasc: Record<number, string> = {
      1: 'primeiro', 2: 'segundo', 3: 'terceiro', 4: 'quarto', 5: 'quinto',
      6: 'sexto', 7: 'sétimo', 8: 'oitavo', 9: 'nono', 10: 'décimo',
    };
    const ordinaisFem: Record<number, string> = {
      1: 'primeira', 2: 'segunda', 3: 'terceira', 4: 'quarta', 5: 'quinta',
      6: 'sexta', 7: 'sétima', 8: 'oitava', 9: 'nona', 10: 'décima',
    };

    text = text.replace(/\b(\d+)[º°]\b/g, (match, num) => {
      const n = parseInt(num, 10);
      return ordinaisMasc[n] || match;
    });

    text = text.replace(/\b(\d+)ª\b/g, (match, num) => {
      const n = parseInt(num, 10);
      return ordinaisFem[n] || match;
    });

    return text;
  }

  private normalizeRomanNumerals(text: string): string {
    const romanos: Record<string, number> = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
      'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
      'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
      'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
      'XXI': 21,
    };

    return text.replace(/\b(Século|Capítulo|Artigo|Inciso|Volume|Tomo|Papa|Dom|Rei|João| Bento|Pio|Paulo)\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI)\b/gi, (match, prefix, roman) => {
      const val = romanos[roman.toUpperCase()];
      if (!val) return match;

      const pLower = prefix.toLowerCase();
      if (['artigo', 'inciso', 'capítulo'].includes(pLower) && val <= 10) {
        const ordinais = ['', 'primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono', 'décimo'];
        return `${prefix} ${ordinais[val]}`;
      }

      return `${prefix} ${this.numberToWords(val)}`;
    });
  }

  private normalizeNumbers(text: string): string {
    text = text.replace(/\b\d{1,3}(?:\.\d{3})+\b/g, (match) => {
      const cleanNum = parseInt(match.replace(/\./g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum <= 999999999) {
        return this.numberToWords(cleanNum);
      }
      return match;
    });

    text = text.replace(/\b(\d+),(\d+)\b/g, (_, intPart, decPart) => {
      const i = parseInt(intPart, 10);
      const d = parseInt(decPart, 10);
      return `${this.numberToWords(i)} vírgula ${this.numberToWords(d)}`;
    });

    text = text.replace(/\b\d+\b/g, (match) => {
      if (match.length > 1 && match.startsWith('0')) {
        const stripped = parseInt(match, 10);
        if (match.length <= 3 && !isNaN(stripped)) {
          return this.numberToWords(stripped);
        }
        return this.digitsToWords(match);
      }
      const n = parseInt(match, 10);
      if (!isNaN(n) && n <= 999999999) {
        return this.numberToWords(n);
      }
      return match;
    });

    return text;
  }

  private digitsToWords(digits: string): string {
    const map: Record<string, string> = {
      '0': 'zero', '1': 'um', '2': 'dois', '3': 'três', '4': 'quatro',
      '5': 'cinco', '6': 'seis', '7': 'sete', '8': 'oito', '9': 'nove',
    };
    return digits.split('').map((d) => map[d] || d).join(' ');
  }

  public numberToWords(n: number): string {
    if (n === 0) return 'zero';
    if (n < 0) return `menos ${this.numberToWords(Math.abs(n))}`;

    let words = '';

    if (n >= 1000000) {
      const milhoes = Math.floor(n / 1000000);
      words += `${this.convertHundreds(milhoes)} ${milhoes === 1 ? 'milhão' : 'milhões'}`;
      n %= 1000000;
      if (n > 0) {
        words += n < 100 || n % 100 === 0 ? ' e ' : ', ';
      }
    }

    if (n >= 1000) {
      const milhares = Math.floor(n / 1000);
      if (milhares === 1) {
        words += 'mil';
      } else {
        words += `${this.convertHundreds(milhares)} mil`;
      }
      n %= 1000;
      if (n > 0) {
        words += n < 100 || n % 100 === 0 ? ' e ' : ', ';
      }
    }

    if (n > 0) {
      words += this.convertHundreds(n);
    }

    return words.trim();
  }

  private convertHundreds(n: number): string {
    if (n === 100) return 'cem';

    let str = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) {
      str += CENTENAS[c];
    }

    if (d === 1) {
      if (str) str += ' e ';
      str += DEZ_A_DEZENOVE[u];
    } else {
      if (d > 1) {
        if (str) str += ' e ';
        str += DEZENAS[d];
      }
      if (u > 0) {
        if (str) str += ' e ';
        str += UNIDADES[u];
      }
    }

    return str;
  }

  private cleanUp(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,;:!?])/g, '$1')
      .trim();
  }
}
