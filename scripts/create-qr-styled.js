const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createStyledQR() {
  // Generera QR-kod data
  const qrData = await QRCode.create('https://www.eteya.ai/sv/om-oss/filip', {
    errorCorrectionLevel: 'H'
  });

  const modules = qrData.modules;
  const moduleCount = modules.size;
  const moduleSize = 18; // Större moduler för rundade kanter
  const qrSize = moduleCount * moduleSize;
  const margin = moduleSize * 4;
  const totalSize = qrSize + (margin * 2);

  // Canvas
  const canvas = createCanvas(1000, 1200);
  const ctx = canvas.getContext('2d');

  // Vit bakgrund
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1000, 1200);

  // Hörn accents (Eteya grön)
  drawCorner(ctx, 80, 180, 80, 80, 160, 80, '#C8FF00', 5);
  drawCorner(ctx, 920, 180, 920, 80, 840, 80, '#C8FF00', 5);
  drawCorner(ctx, 80, 1020, 80, 1120, 160, 1120, '#C8FF00', 5);
  drawCorner(ctx, 920, 1020, 920, 1120, 840, 1120, '#C8FF00', 5);

  // Text (svart)
  ctx.textAlign = 'center';

  // "N° 001 — AUTH 14:32"
  ctx.font = '14px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText('N° 001 — AUTH 14:32', 500, 160);

  // "FILIP THAI"
  ctx.font = 'bold 64px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('FILIP THAI', 500, 240);

  // "GRUNDARE & VD · ETEYA CONSULTING"
  ctx.font = '14px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillText('GRUNDARE & VD · ETEYA CONSULTING', 500, 290);

  // QR-kod container (centrerad)
  const qrX = (1000 - totalSize) / 2;
  const qrY = 340;

  // Rita QR-kod med runda moduler
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      const x = qrX + margin + (col * moduleSize);
      const y = qrY + margin + (row * moduleSize);
      const isDark = modules.get(row, col);

      if (isDark) {
        // Bestäm om detta är en position marker (hörn)
        const isPositionMarker = (
          (row < 8 && col < 8) || // Övre vänster
          (row < 8 && col >= moduleCount - 8) || // Övre höger
          (row >= moduleCount - 8 && col < 8) // Nedre vänster
        );

        if (isPositionMarker) {
          // Position markers = Eteya grön med rundade hörn
          ctx.fillStyle = '#C8FF00';
          roundRect(ctx, x, y, moduleSize - 2, moduleSize - 2, 4);
          ctx.fill();
        } else {
          // Vanliga moduler = svart med rundade hörn
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(x + moduleSize/2 - 1, y + moduleSize/2 - 1, moduleSize/2 - 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Position marker öar (de stora fyrkanterna i hörnen)
  drawPositionMarker(ctx, qrX + margin, qrY + margin, moduleSize * 7);
  drawPositionMarker(ctx, qrX + margin + (moduleCount - 7) * moduleSize, qrY + margin, moduleSize * 7);
  drawPositionMarker(ctx, qrX + margin, qrY + margin + (moduleCount - 7) * moduleSize, moduleSize * 7);

  // Logo i mitten (större, mer prominent)
  const centerX = qrX + margin + (moduleCount * moduleSize) / 2;
  const centerY = qrY + margin + (moduleCount * moduleSize) / 2;
  const logoRadius = 55;

  // Logo bakgrund (Eteya grön med glow)
  ctx.fillStyle = '#C8FF00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoRadius + 8, 0, Math.PI * 2);
  ctx.fill();

  // Logo border
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoRadius + 8, 0, Math.PI * 2);
  ctx.stroke();

  // E-logga (svart)
  ctx.font = 'bold 72px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', centerX, centerY);

  // "SCANNA FÖR ATT SPARA KONTAKT"
  ctx.font = 'bold 24px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SCANNA FÖR ATT SPARA KONTAKT', 500, 1120);

  // URL
  ctx.font = '14px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillText('WWW.ETEYA.AI/SV/OM-OSS/FILIP', 500, 1160);

  // Footer line
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 1185);
  ctx.lineTo(650, 1185);
  ctx.stroke();

  // Footer text
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 500, 1205);

  // Spara
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/qr-filip-styled.png', buffer);
  console.log('✅ STYLED QR-KOD GENERERAD!');
  console.log('   - Runda moduler (dots istället för fyrkanter)');
  console.log('   - Position markers i Eteya grön (#C8FF00)');
  console.log('   - Större "E"-logga i mitten');
  console.log('   - Vit bakgrund + svart text');
  console.log('   - Modern, premium design');
}

function drawPositionMarker(ctx, x, y, size) {
  // Yttre ruta
  ctx.fillStyle = '#C8FF00';
  roundRect(ctx, x, y, size, size, 8);
  ctx.fill();

  // Inre ruta
  ctx.fillStyle = '#000000';
  roundRect(ctx, x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7, 4);
  ctx.fill();

  // Centrum
  ctx.fillStyle = '#C8FF00';
  roundRect(ctx, x + size * 0.35, y + size * 0.35, size * 0.3, size * 0.3, 2);
  ctx.fill();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCorner(ctx, x1, y1, x2, y2, x3, y3, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();
}

createStyledQR().catch(err => console.error('Fel:', err.message));
