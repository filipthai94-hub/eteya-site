const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createV3QR() {
  // Generera QR-kod med HÖGSTA felkorrigering
  const qrDataUrl = await QRCode.toDataURL('https://www.eteya.ai/sv/om-oss/filip', {
    width: 700,
    margin: 2,
    color: { dark: '#080808', light: '#FFFFFF' }, // Svart QR-kod på vit bakgrund
    errorCorrectionLevel: 'H'
  });

  const qrImage = await loadImage(qrDataUrl);

  // Canvas
  const canvas = createCanvas(900, 1100);
  const ctx = canvas.getContext('2d');

  // Vit bakgrund
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 900, 1100);

  // Hörn accents (Eteya grön)
  drawCorner(ctx, 60, 140, 60, 60, 120, 60, '#C8FF00', 4);
  drawCorner(ctx, 840, 140, 840, 60, 780, 60, '#C8FF00', 4);
  drawCorner(ctx, 60, 960, 60, 1040, 120, 1040, '#C8FF00', 4);
  drawCorner(ctx, 840, 960, 840, 1040, 780, 1040, '#C8FF00', 4);

  // Text (svart)
  ctx.textAlign = 'center';

  // "N° 001 — AUTH 14:32"
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillText('N° 001 — AUTH 14:32', 450, 140);

  // "FILIP THAI"
  ctx.font = 'bold 58px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('FILIP THAI', 450, 210);

  // "GRUNDARE & VD · ETEYA CONSULTING"
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillText('GRUNDARE & VD · ETEYA CONSULTING', 450, 260);

  // QR-kod (centrerad, större)
  const qrSize = 650;
  const qrX = (900 - qrSize) / 2;
  const qrY = 310;
  
  // Vit bakgrund för QR-koden
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 20);
  ctx.fill();
  
  // Subtil border runt QR-koden
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 20);
  ctx.stroke();

  // QR-kod med rundade kanter (clip)
  ctx.save();
  roundRect(ctx, qrX, qrY, qrSize, qrSize, 16);
  ctx.clip();
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  ctx.restore();

  // Logo i mitten (Eteya grön bakgrund, svart text)
  const logoSize = 130;
  
  // Logo bakgrund (Eteya grön)
  ctx.fillStyle = '#C8FF00';
  ctx.beginPath();
  ctx.arc(450, 635, logoSize/2 + 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Logo border (svart)
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(450, 635, logoSize/2 + 6, 0, Math.PI * 2);
  ctx.stroke();

  // E-logga (svart)
  ctx.font = 'bold 60px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', 450, 635);

  // "SCANNA FÖR ATT SPARA KONTAKT" (svart text)
  ctx.font = 'bold 22px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SCANNA FÖR ATT SPARA KONTAKT', 450, 1020);

  // URL (mörkgrå)
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillText('WWW.ETEYA.AI/SV/OM-OSS/FILIP', 450, 1055);

  // Footer line (ljusgrå)
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(300, 1080);
  ctx.lineTo(600, 1080);
  ctx.stroke();

  // Footer text (mörkgrå)
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 450, 1100);

  // Spara
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/qr-filip-v3.png', buffer);
  console.log('✅ QR-KOD V3 GENERERAD!');
  console.log('   - Vit bakgrund');
  console.log('   - Svart text');
  console.log('   - Eteya grön (#C8FF00) hörn accents');
  console.log('   - Svart QR-kod');
  console.log('   - Ingen ram runt kortet');
  console.log('   - Bara hörnen kvar');
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

createV3QR().catch(err => console.error('Fel:', err.message));
