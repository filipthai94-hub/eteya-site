const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createV2QR() {
  // 1. Generera QR-kod med HÖGSTA felkorrigering
  const qrDataUrl = await QRCode.toDataURL('https://www.eteya.ai/sv/om-oss/filip', {
    width: 700,
    margin: 2,
    color: { dark: '#C8FF00', light: '#080808' },
    errorCorrectionLevel: 'H'
  });

  const qrImage = await loadImage(qrDataUrl);

  // 2. Canvas
  const canvas = createCanvas(900, 1100);
  const ctx = canvas.getContext('2d');

  // 3. Bakgrund
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, 900, 1100);

  // 4. Kort-bakgrund
  ctx.fillStyle = '#111111';
  roundRect(ctx, 50, 50, 800, 1000, 28);
  ctx.fill();
  
  // Kort-border med glow
  ctx.strokeStyle = 'rgba(200,255,0,0.25)';
  ctx.lineWidth = 2;
  roundRect(ctx, 50, 50, 800, 1000, 28);
  ctx.stroke();

  // 5. Corner accents (tjockare + glow)
  drawCorner(ctx, 50, 120, 50, 74, 86, 74, '#C8FF00', 3);
  drawCorner(ctx, 850, 120, 850, 74, 814, 74, '#C8FF00', 3);
  drawCorner(ctx, 50, 980, 50, 1026, 86, 1026, '#C8FF00', 3);
  drawCorner(ctx, 850, 980, 850, 1026, 814, 1026, '#C8FF00', 3);

  // 6. Text
  ctx.textAlign = 'center';

  // "N° 001 — AUTH 14:32"
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('N° 001 — AUTH 14:32', 450, 140);

  // "FILIP THAI"
  ctx.font = 'bold 58px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#F5F5F5';
  ctx.fillText('FILIP THAI', 450, 210);

  // "GRUNDARE & VD · ETEYA CONSULTING"
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('GRUNDARE & VD · ETEYA CONSULTING', 450, 260);

  // 7. QR-kod container (större)
  const qrSize = 650;
  const qrX = (900 - qrSize) / 2; // 125
  const qrY = 310;
  
  // QR-kod bakgrund (rundad)
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 20);
  ctx.stroke();

  // QR-kod med rundade kanter (clip)
  ctx.save();
  roundRect(ctx, qrX, qrY, qrSize, qrSize, 16);
  ctx.clip();
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  ctx.restore();

  // 8. Logo i mitten (större)
  const logoSize = 130;
  const logoX = 450 - logoSize/2; // 385
  const logoY = 635 - logoSize/2; // 570
  
  // Logo bakgrund (större, med glow)
  ctx.fillStyle = '#080808';
  ctx.beginPath();
  ctx.arc(450, 635, logoSize/2 + 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Logo border
  ctx.strokeStyle = 'rgba(200,255,0,0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(450, 635, logoSize/2 + 6, 0, Math.PI * 2);
  ctx.stroke();

  // E-logga (större)
  ctx.font = 'bold 60px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#C8FF00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', 450, 635);

  // Scan-pil/ikon
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'rgba(200,255,0,0.5)';
  ctx.fillText('⬇', 450, 720);

  // 9. "SCANNA FÖR ATT SPARA KONTAKT" (större)
  ctx.font = 'bold 22px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#C8FF00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SCANNA FÖR ATT SPARA KONTAKT', 450, 1020);

  // 10. URL (större)
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('WWW.ETEYA.AI/SV/OM-OSS/FILIP', 450, 1055);

  // 11. Footer line
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(300, 1080);
  ctx.lineTo(600, 1080);
  ctx.stroke();

  // Footer text
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 450, 1100);

  // Spara
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/qr-filip-v2.png', buffer);
  console.log('✅ QR-KOD V2 GENERERAD!');
  console.log('   - Större QR-kod (650px)');
  console.log('   - Större "E"-logga (130px)');
  console.log('   - Rundade kanter på QR-koden');
  console.log('   - Mer marginal (quiet zone)');
  console.log('   - Tjockare corner accents (3px)');
  console.log('   - Större URL-text (13px)');
  console.log('   - Scan-pil (⬇)');
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

createV2QR().catch(err => console.error('Fel:', err.message));
