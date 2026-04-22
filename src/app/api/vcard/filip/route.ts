import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read profile image and convert to base64
    const imagePath = path.join(process.cwd(), 'public', 'images', 'team', 'filip.png');
    const imageBuffer = await fs.readFile(imagePath);
    const base64Photo = imageBuffer.toString('base64');

    // Create vCard 3.0 format
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Filip Thai
N:Thai;Filip;;;
ORG:Eteya Consulting AB
TITLE:Grundare & VD
TEL;TYPE=CELL:+46 73 982 39 62
EMAIL;TYPE=WORK:kontakt@eteya.ai
URL:https://eteya.ai
PHOTO;ENCODING=b;TYPE=PNG:${base64Photo}
X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/filip-thai-10449a3b6/
ADR;TYPE=WORK:;;Karlskoga;;;SE
END:VCARD`;

    // Return vCard with correct headers for download
    return new NextResponse(vcard, {
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Filip-Thai.vcf"',
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return new NextResponse('Error generating vCard', { status: 500 });
  }
}
