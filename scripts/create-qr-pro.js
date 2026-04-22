const QRCode = require('qrcode');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

async function createProQR() {
  // Generera ren QR-kod
  const qrDataUrl = await QRCode.toDataURL('https://www.eteya.ai/sv/om-oss/filip', {
    width: 600,
    margin: 2,
    color: {
      dark: '#C8FF00',
      light: '#080808'
    },
    errorCorrectionLevel: 'H'
  });

  // Ladda QR-koden som bild
  const qrImage = await loadImage(qrDataUrl);

  // Skapa canvas
  const canvas = createCanvas(800, 1000);
  const ctx = canvas.getContext('2d');

  // Bakgrund
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, 800, 1000);

  // Kort-bakgrund
  ctx.fillStyle = '#111111';
  roundRect(ctx, 40, 40, 720, 920, 24);
  ctx.fill();

  // Kort-border
  ctx.strokeStyle = 'rgba(200,255,0,0.2)';
  ctx.lineWidth = 2;
  roundRect(ctx, 40, 40, 720, 920, 24);
  ctx.stroke();

  // Corner accents
  drawCorner(ctx, 40, 100, 40, 64, 76, 64, '#C8FF00');
  drawCorner(ctx, 760, 100, 760, 64, 724, 64, '#C8FF00');
  drawCorner(ctx, 40, 900, 40, 936, 76, 936, '#C8FF00');
  drawCorner(ctx, 760, 900, 760, 936, 724, 936, '#C8FF00');

  // Text
  ctx.textAlign = 'center';

  // "N° 001 — AUTH 14:32"
  ctx.font = '12px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('N° 001 — AUTH 14:32', 400, 140);

  // "FILIP THAI"
  ctx.font = 'bold 52px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#F5F5F5';
  ctx.fillText('FILIP THAI', 400, 200);

  // "GRUNDARE & VD · ETEYA CONSULTING"
  ctx.font = '12px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('GRUNDARE & VD · ETEYA CONSULTING', 400, 250);

  // QR-kod
  ctx.drawImage(qrImage, 100, 300, 600, 600);

  // "SCANNA FÖR ATT SPARA KONTAKT"
  ctx.font = 'bold 20px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#C8FF00';
  ctx.fillText('SCANNA FÖR ATT SPARA KONTAKT', 400, 900);

  // URL
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('WWW.ETEYA.AI/SV/OM-OSS/FILIP', 400, 940);

  // Footer line
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(250, 980);
  ctx.lineTo(550, 980);
  ctx.stroke();

  // Footer text
  ctx.font = '8px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText('STOCKHOLM / SE · © 2026 ETEYA CONSULTING AB', 400, 1000);

  // Spara
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/qr-filip-pro.png', buffer);
  console.log('✅ PROFFSIG QR-kod genererad: qr-filip-pro.png');
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

function drawCorner(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();
}

createProQR().catch(console.error);
