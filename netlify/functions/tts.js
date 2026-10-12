import { EdgeTTS } from 'edge-tts-universal';
import crypto from 'node:crypto';

// Cache em memoria para frases frequentes durante a vida da funcao serverless
const audioCache = new Map();
const MAX_CACHE_SIZE = 150;

async function fetchGoogleTts(text, lang = 'pt') {
  const normalized = String(lang).toLowerCase().replace('_', '-');
  let tl = 'pt';
  if (normalized.startsWith('en')) {
    tl = 'en';
  } else if (normalized.startsWith('he') || normalized.startsWith('iw')) {
    tl = 'iw';
  }
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) throw new Error(`Google TTS HTTP ${res.status}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab).toString('base64');
}

export async function handler(event, _context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  // Probe / Health check
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'online',
        service: 'Acre Acessivel Neural TTS',
        defaultVoice: 'pt-BR-FranciscaNeural',
        supportedVoices: {
          pt: 'pt-BR-FranciscaNeural',
          en: 'en-US-JennyNeural',
          he: 'he-IL-HilaNeural',
        },
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const text = (payload.text || '').trim();

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Texto nao fornecido.' }),
      };
    }

    const VOICE_MAP = {
      'pt-br': 'pt-BR-FranciscaNeural',
      'pt': 'pt-BR-FranciscaNeural',
      'en-us': 'en-US-JennyNeural',
      'en': 'en-US-JennyNeural',
      'he-il': 'he-IL-HilaNeural',
      'he': 'he-IL-HilaNeural',
      'iw': 'he-IL-HilaNeural',
    };

    let voice = payload.voice;
    if (!voice && payload.lang) {
      const normalizedLang = String(payload.lang).toLowerCase().replace('_', '-');
      voice = VOICE_MAP[normalizedLang] || VOICE_MAP[normalizedLang.split('-')[0]];
    }
    if (!voice) {
      voice = 'pt-BR-FranciscaNeural';
    }
    const rate = payload.rate || '+0%';
    const pitch = payload.pitch || '+0Hz';

    // Chave de cache
    const cacheKey = crypto.createHash('md5').update(`${voice}:${rate}:${pitch}:${text}`).digest('hex');

    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey);
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-Cache': 'HIT',
        },
        body: cached,
        isBase64Encoded: true,
      };
    }


    // Sintese neural via EdgeTTS com timeout de seguranca (2.5s) e fallback para Google TTS
    let base64Audio;
    try {
      const edgePromise = (async () => {
        const tts = new EdgeTTS(text, voice, { rate, pitch });
        const result = await tts.synthesize();
        const arrayBuffer = await result.audio.arrayBuffer();
        return Buffer.from(arrayBuffer).toString('base64');
      })();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('EdgeTTS timeout (2500ms)')), 2500);
      });

      base64Audio = await Promise.race([edgePromise, timeoutPromise]);
    } catch (edgeErr) {
      console.warn('EdgeTTS indisponivel, usando fallback neural de alta disponibilidade:', edgeErr?.message || edgeErr);
      base64Audio = await fetchGoogleTts(text, payload.lang || 'pt');
    }

    // Salva no cache da instancia
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, base64Audio);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'MISS',
      },
      body: base64Audio,
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('Erro na sintese TTS:', err);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Erro na geracao de audio TTS',
        detail: err.message || String(err),
      }),
    };
  }
}
