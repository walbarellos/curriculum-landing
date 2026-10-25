#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================="
echo " ★ CURRICULUM — DEPLOY UNIFICADO & SEGURO"
echo "=========================================="

echo ""
echo "▶ [1/3] Enviando código para Codeberg e GitHub..."
git push -u origin main
git push github main
echo "✓ Repositórios atualizados!"

echo ""
echo "▶ [2/3] Gerando build de produção limpo..."
npm run build
echo "✓ Build concluído!"

echo ""
echo "▶ [3/3] Publicando pasta 'dist' no Netlify..."
netlify deploy --prod --dir=dist --skip-functions-cache

echo ""
echo "=========================================="
echo " ★ Deploy finalizado com sucesso!"
echo "=========================================="
