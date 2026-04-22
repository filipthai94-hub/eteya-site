const sharp = require('sharp');
const jsQR = require('jsqr');

async function testQR() {
  try {
    // Läs bilden med sharp
    const { data, info } = await sharp('./public/qr-agit.png')
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // jsQR förväntar sig RGBA-data
    const qrData = jsQR(data, info.width, info.height);
    
    if (qrData) {
      console.log('✅ QR-KOD FUNGERAR!');
      console.log('   URL:', qrData.data);
    } else {
      console.log('❌ QR-koden kunde inte avkodas');
    }
  } catch (err) {
    console.log('❌ Fel:', err.message);
  }
}

testQR();
