const { EdgeTTS } = require('edge-tts-universal');
const crypto = require('crypto');

// Cache em memória para frases frequentes durante a vida da função serverless
const audioCache = new Map();
const MAX_CACHE_SIZE = 150;

exports.handler = async function (event, context) {
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
        service: 'Acre Acessível Neural TTS',
        defaultVoice: 'pt-BR-FranciscaNeural',
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
        body: JSON.stringify({ error: 'Texto não fornecido.' }),
      };
    }

    const voice = payload.voice || 'pt-BR-FranciscaNeural';
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

    // Síntese neural via EdgeTTS
    const tts = new EdgeTTS(text, voice, { rate, pitch });
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // Salva no cache da instância
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
    console.error('Erro na síntese TTS:', err);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Erro na geração de áudio TTS',
        detail: err.message || String(err),
      }),
    };
  }
};
