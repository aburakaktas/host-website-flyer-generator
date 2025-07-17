import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

async function extractMainImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 1. og:image
    const og = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (og) return og;
    // 2. twitter:image
    const tw = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    if (tw) return tw;
    // 3. Largest <img>
    let largestImg: Element | null = null;
    let largestArea = 0;
    const imgs = doc.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    imgs.forEach(img => {
      const w = parseInt(img.getAttribute('width') || '0', 10);
      const h = parseInt(img.getAttribute('height') || '0', 10);
      const area = w * h;
      if (area > largestArea) {
        largestArea = area;
        largestImg = img;
      }
    });
    if (largestImg && (largestImg as HTMLImageElement).src) return (largestImg as HTMLImageElement).src;
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    const imageUrl = await extractMainImage(url);
    if (!imageUrl) return NextResponse.json({ error: 'Could not extract image' }, { status: 422 });

    // Fetch image as base64
    const imgRes = await fetch(imageUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const imgType = imgRes.headers.get('content-type') || 'image/jpeg';
    const imgBase64 = `data:${imgType};base64,${imgBuffer.toString('base64')}`;

    // Generate QR code as base64
    const qrBase64 = await QRCode.toDataURL(url, { margin: 0, width: 256 });

    return NextResponse.json({ image: imgBase64, qr: qrBase64 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 