const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createSafeQR(name, title, url, filename) {
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

  drawCorner(ctx, 60, 140, 60, 60, 120, 60, '#C8FF00', 6);
  drawCorner(ctx, 740, 140, 740, 60, 680, 60, '#C8FF00', 6);
  drawCorner(ctx, 60, 860, 60, 940, 120, 940, '#C8FF00', 6);
  drawCorner(ctx, 740, 860, 740, 940, 680, 940, '#C8FF00', 6);

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
  fs.writeFileSync(`./public/${filename}`, buffer);
  console.log(`✅ ${filename} genererad!`);
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

async function generateAll() {
  await createSafeQR(
    'Filip Thai',
    'Grundare \u0026 VD',
    'https://www.eteya.ai/sv/om-oss/filip',
    'qr-filip-safe.png'
  );
  
  await createSafeQR(
    'Agit Akalp',
    'Medgrundare',
    'https://www.eteya.ai/sv/om-oss/agit',
    'qr-agit-safe.png'
  );
  
  console.log('');
  console.log('🎯 TESTA ATT SCANNA:');
  console.log('   1. Öppna bilderna på din telefon');
  console.log('   2. Använd kameran för att scanna');
  console.log('   3. De ska öppna respektive sida');
}

generateAll().catch(err => console.error('Fel:', err));
