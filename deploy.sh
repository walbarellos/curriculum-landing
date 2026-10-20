#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================="
echo " ★ CURRICULUM — DEPLOY UNIFICADO & SEGURO"
echo "=========================================="

echo ""
echo "▶ [1/3] Enviando código para o Codeberg..."
git push -u origin main
echo "✓ Codeberg atualizado!"

echo ""
echo "▶ [2/3] Gerando build de produção limpo..."
npm run build
echo "✓ Build concluído!"

echo ""
echo "▶ [3/3] Publicando pasta 'dist' no Netlify..."
netlify deploy --prod --dir=dist

echo ""
echo "=========================================="
echo " ★ Deploy finalizado com sucesso!"
echo "=========================================="
