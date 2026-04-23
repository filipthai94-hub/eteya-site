#!/bin/bash

# ============================================================
# HERMES & QR-KOD AUTOMATISERING - ETEYA
# Skapad av Aline för Filip
# Användning: ./scripts/setup-hermes-and-qr.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      HERMES + QR-KOD AUTOMATISERING - ETEYA              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================
# DEL 1: KOLLA HERMES KONFIG
# ============================================================
echo -e "\n${YELLOW}▶ DEL 1: Kollar Hermes konfig...${NC}"

HERMES_CONFIG=""
if [ -f "$HOME/.hermes/config.yaml" ]; then
    HERMES_CONFIG="$HOME/.hermes/config.yaml"
elif [ -f "$HOME/.config/hermes/config.yaml" ]; then
    HERMES_CONFIG="$HOME/.config/hermes/config.yaml"
else
    echo -e "${RED}❌ Hittade ingen Hermes config!${NC}"
    echo "   Letade i:"
    echo "   - ~/.hermes/config.yaml"
    echo "   - ~/.config/hermes/config.yaml"
    exit 1
fi

echo -e "${GREEN}✅ Hittade config: $HERMES_CONFIG${NC}"

# Kolla nuvarande config
echo -e "\n${YELLOW}Nuvarande inställningar:${NC}"
grep -A5 "^model:" "$HERMES_CONFIG" | grep -E "(base_url|provider|default)" | sed 's/^/   /'

# Kolla om base_url pekar på lokal
current_url=$(grep "base_url" "$HERMES_CONFIG" | head -1 | awk '{print $2}')

if echo "$current_url" | grep -q "127.0.0.1"; then
    echo -e "\n${RED}⚠️  PROBLEM HITTAT!${NC}"
    echo "   Din Hermes pekar på Lokal Ollama: $current_url"
    echo "   Men provider är satt till: ollama-cloud"
    echo ""
    
    read -p "🤔 Vill du fixa detta nu? (ja/nej): " FIX_CONFIG
    
    if [ "$FIX_CONFIG" = "ja" ]; then
        echo -e "\n${YELLOW}📝 Läser in din API-nyckel...${NC}"
        
        # Hämta API-nyckel från fil om den finns
        API_KEY=""
        if [ -f "$HOME/.ollama/api_key" ]; then
            API_KEY=$(cat "$HOME/.ollama/api_key" | tr -d '\n')
            echo -e "${GREEN}✅ Hittade API-nyckel i ~/.ollama/api_key${NC}"
        fi
        
        if [ -z "$API_KEY" ]; then
            read -p "🔑 Ange din Ollama Cloud API-nyckel (sk-början): " API_KEY
        fi
        
        if [ -z "$API_KEY" ]; then
            echo -e "${RED}❌ Ingen API-nyckel angiven. Avbryter.${NC}"
            exit 1
        fi
        
        # Skapa backup
        cp "$HERMES_CONFIG" "$HERMES_CONFIG.backup.$(date +%Y%m%d%H%M%S)"
        echo -e "${GREEN}✅ Backup skapad${NC}"
        
        # Uppdatera config
        sed -i '' 's|base_url: http://127.0.0.1:11434/v1|base_url: https://api.ollama.com/v1|' "$HERMES_CONFIG"
        
        # Lägg till api_key om den inte finns
        if ! grep -q "api_key" "$HERMES_CONFIG"; then
            sed -i '' "/base_url:/a\\  api_key: $API_KEY" "$HERMES_CONFIG"
        fi
        
        echo -e "${GREEN}✅ Hermes config uppdaterad!${NC}"
        
        # Spara API-nyckel för framtiden
        mkdir -p "$HOME/.ollama"
        echo "$API_KEY" > "$HOME/.ollama/api_key"
        chmod 600 "$HOME/.ollama/api_key"
        
        echo -e "${GREEN}✅ API-nyckel sparad i ~/.ollama/api_key${NC}"
    fi
else
    echo -e "${GREEN}✅ Hermes config ser korrekt ut!${NC}"
fi

# ============================================================
# DEL 2: GENERERA QR-KODER
# ============================================================
echo -e "\n${YELLOW}▶ DEL 2: QR-Kod generator${NC}"

cd "$PROJECT_DIR"

# Kontrollera att nödvändiga paket finns
echo "   Kollar npm-paket..."
if [ ! -d "node_modules/canvas" ] || [ ! -d "node_modules/qrcode" ]; then
    echo -e "${YELLOW}   Installerar nödvändiga paket...${NC}"
    npm install canvas qrcode 2>&1 | tail -3
fi

echo -e "${GREEN}   ✅ Alla paket installerade${NC}"

# Generera QR-koder
cat > scripts/temp-qr.js << 'QRSCRIPT'
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateQR(name, title, url, filename) {
    const qrDataUrl = await QRCode.toDataURL(url, {
        width: 500,
        margin: 3,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'H'
    });

    const qrImage = await loadImage(qrDataUrl);
    const canvas = createCanvas(800, 1000);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 800, 1000);

    function drawCorner(x1, y1, x2, y2, x3, y3, color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();
    }

    drawCorner(60, 140, 60, 60, 120, 60, '#C8FF00', 6);
    drawCorner(740, 140, 740, 60, 680, 60, '#C8FF00', 6);
    drawCorner(60, 860, 60, 940, 120, 940, '#C8FF00', 6);
    drawCorner(740, 860, 740, 940, 680, 940, '#C8FF00', 6);

    ctx.textAlign = 'center';
    
    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('N° 001 — AUTH 14:32', 400, 140);

    ctx.font = 'bold 56px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(name.toUpperCase(), 400, 220);

    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(title.toUpperCase() + ' · ETEYA CONSULTING', 400, 270);

    ctx.drawImage(qrImage, 150, 320, 500, 500);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('SCANNA FÖR ATT SPARA KONTAKT', 400, 900);

    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillText(url.toUpperCase().replace('HTTPS://', ''), 400, 940);

    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 970);
    ctx.lineTo(550, 970);
    ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 400, 990);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/' + filename, buffer);
    console.log('✅ ' + filename + ' genererad!');
}

async function generateAll() {
    await generateQR('Filip Thai', 'Grundare \u0026 VD', 'https://www.eteya.ai/sv/om-oss/filip', 'qr-filip.png');
    await generateQR('Agit Akalp', 'Medgrundare', 'https://www.eteya.ai/sv/om-oss/agit', 'qr-agit.png');
}

generateAll().catch(err => {
    console.error('Fel:', err);
    process.exit(1);
});
QRSCRIPT

node scripts/temp-qr.js
rm -f scripts/temp-qr.js

# ============================================================
# SAMMANFATTNING
# ============================================================
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ALLT KLART! ✅                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Skapade filer:${NC}"
ls -lh "$PROJECT_DIR/public/qr-*.png" 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'

echo -e "\n${YELLOW}Nästa steg:${NC}"
echo "   1. Testa scanna QR-koderna med din telefon"
echo "   2. Kontrollera att de länkar rätt"
echo "   3. Använd i visitkort, mail-signaturer, etc."
echo ""
echo -e "${BLUE}📁 Filerna sparade i: public/qr-*.png${NC}"
echo -e "${BLUE}💡 Tips: Lägg dem i Google Drive för enkel delning${NC}"

echo -e "\n${GREEN}✨ Klart!${NC}"
