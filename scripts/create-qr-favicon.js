const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createQRWithFavicon() {
  const qrData = await QRCode.create('https://www.eteya.ai/sv/om-oss/filip', {
    errorCorrectionLevel: 'H'
  });

  const modules = qrData.modules;
  const moduleCount = modules.size;
  const moduleSize = 18;
  const qrSize = moduleCount * moduleSize;
  const margin = moduleSize * 4;
  const totalSize = qrSize + (margin * 2);

  const canvas = createCanvas(1000, 1200);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1000, 1200);

  drawCorner(ctx, 80, 180, 80, 80, 160, 80, '#C8FF00', 5);
  drawCorner(ctx, 920, 180, 920, 80, 840, 80, '#C8FF00', 5);
  drawCorner(ctx, 80, 1020, 80, 1120, 160, 1120, '#C8FF00', 5);
  drawCorner(ctx, 920, 1020, 920, 1120, 840, 1120, '#C8FF00', 5);

  ctx.textAlign = 'center';

  ctx.font = '14px DejaVuMono';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText('N° 001 — AUTH 14:32', 500, 160);

  ctx.font = 'bold 64px DejaVu';
  ctx.fillStyle = '#000000';
  ctx.fillText('FILIP THAI', 500, 240);

  ctx.font = '14px DejaVuMono';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillText('GRUNDARE & VD · ETEYA CONSULTING', 500, 290);

  const qrX = (1000 - totalSize) / 2;
  const qrY = 340;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      const x = qrX + margin + (col * moduleSize);
      const y = qrY + margin + (row * moduleSize);
      const isDark = modules.get(row, col);

      if (isDark) {
        const isPositionMarker = (
          (row < 8 && col < 8) ||
          (row < 8 && col >= moduleCount - 8) ||
          (row >= moduleCount - 8 && col < 8)
        );

        if (isPositionMarker) {
          ctx.fillStyle = '#C8FF00';
          roundRect(ctx, x, y, moduleSize - 2, moduleSize - 2, 4);
          ctx.fill();
        } else {
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(x + moduleSize/2 - 1, y + moduleSize/2 - 1, moduleSize/2 - 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  drawPositionMarker(ctx, qrX + margin, qrY + margin, moduleSize * 7);
  drawPositionMarker(ctx, qrX + margin + (moduleCount - 7) * moduleSize, qrY + margin, moduleSize * 7);
  drawPositionMarker(ctx, qrX + margin, qrY + margin + (moduleCount - 7) * moduleSize, moduleSize * 7);

  // Favicon i mitten
  const favicon = await loadImage('./public/favicon-eteya.png');
  const centerX = qrX + margin + (moduleCount * moduleSize) / 2;
  const centerY = qrY + margin + (moduleCount * moduleSize) / 2;
  const logoSize = 120;

  // Vit bakgrund for loggan
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoSize/2 + 10, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoSize/2 + 10, 0, Math.PI * 2);
  ctx.stroke();

  // Rita favicon
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, logoSize/2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(favicon, centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
  ctx.restore();

  ctx.font = 'bold 24px DejaVu';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SCANNA FOR ATT SPARA KONTAKT', 500, 1120);

  ctx.font = '14px DejaVuMono';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillText('WWW.ETEYA.AI/SV/OM-OSS/FILIP', 500, 1160);

  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 1185);
  ctx.lineTo(650, 1185);
  ctx.stroke();

  ctx.font = '10px DejaVuMono';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 500, 1205);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/qr-filip-favicon.png', buffer);
  console.log('QR-KOD MED FAVICON GENERERAD!');
}

function drawPositionMarker(ctx, x, y, size) {
  ctx.fillStyle = '#C8FF00';
  roundRect(ctx, x, y, size, size, 8);
  ctx.fill();

  ctx.fillStyle = '#000000';
  roundRect(ctx, x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7, 4);
  ctx.fill();

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

createQRWithFavicon().catch(err => console.error('Fel:', err.message));
