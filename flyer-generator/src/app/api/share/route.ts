import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// In-memory storage fallback for local development
interface ShareData {
  image: string;
  qr: string;
}

// Vercel KV import with fallback for local development
let kv: {
  set: (key: string, value: ShareData, options?: { ex: number }) => Promise<string | null>;
  get: (key: string) => Promise<ShareData | null>;
} | null = null;

// Try to import and initialize Vercel KV
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
  console.log('Vercel KV initialized successfully');
} catch (error) {
  console.log('Vercel KV not available, using in-memory storage for local development:', error);
  kv = null;
}

const shareStorage = new Map<string, { data: ShareData; timestamp: number }>();

// Clean up old entries (older than 24 hours) - only for in-memory storage
const cleanupOldEntries = () => {
  if (kv) return; // Skip cleanup if using KV
  
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [id, entry] of shareStorage.entries()) {
    if (now - entry.timestamp > maxAge) {
      shareStorage.delete(id);
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('Share API POST called');
    const { image, qr } = await request.json();

    if (!image || !qr) {
      console.error('Missing image or QR code data');
      return NextResponse.json({ error: 'Missing image or QR code data' }, { status: 400 });
    }

    // Generate a unique ID
    const shareId = randomUUID();
    const shareData: ShareData = { image, qr };

    console.log('KV status:', kv ? 'available' : 'null');

    if (kv) {
      // Use Vercel KV for production
      console.log('Attempting to store in Vercel KV with ID:', shareId);
      try {
        await kv.set(`share:${shareId}`, shareData, { ex: 24 * 60 * 60 }); // 24 hours expiry
        console.log('Successfully stored in Vercel KV');
      } catch (kvError) {
        console.error('Vercel KV error, falling back to memory:', kvError);
        // Fallback to memory storage
        cleanupOldEntries();
        shareStorage.set(shareId, {
          data: shareData,
          timestamp: Date.now()
        });
        console.log('Stored in memory as fallback');
      }
    } else {
      // Use in-memory storage for local development
      console.log('Storing in memory with ID:', shareId);
      cleanupOldEntries();
      shareStorage.set(shareId, {
        data: shareData,
        timestamp: Date.now()
      });
      console.log('Successfully stored in memory');
    }

    return NextResponse.json({ 
      success: true, 
      shareId,
      url: `/share/${shareId}`
    });

  } catch (error) {
    console.error('Error storing share data:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Share API GET called');
    const url = new URL(request.url);
    const shareId = url.searchParams.get('id');

    if (!shareId) {
      console.error('Share ID is required');
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    console.log('Looking for shareId:', shareId);
    let shareData: ShareData | null = null;

    console.log('KV status:', kv ? 'available' : 'null');

    if (kv) {
      // Use Vercel KV for production
      console.log('Retrieving from Vercel KV with ID:', shareId);
      try {
        shareData = await kv.get(`share:${shareId}`);
        console.log('KV result:', shareData ? 'found' : 'not found');
      } catch (kvError) {
        console.error('Vercel KV error, checking memory:', kvError);
        // Fallback to memory storage
        const entry = shareStorage.get(shareId);
        if (entry) {
          const now = Date.now();
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          if (now - entry.timestamp <= maxAge) {
            shareData = entry.data;
            console.log('Found in memory fallback');
          } else {
            shareStorage.delete(shareId);
            console.log('Memory entry expired');
          }
        } else {
          console.log('Not found in memory fallback');
        }
      }
    } else {
      // Use in-memory storage for local development
      console.log('Retrieving from memory with ID:', shareId);
      console.log('Memory storage size:', shareStorage.size);
      console.log('Memory keys:', Array.from(shareStorage.keys()));
      const entry = shareStorage.get(shareId);
      if (entry) {
        // Check if entry is expired
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (now - entry.timestamp <= maxAge) {
          shareData = entry.data;
          console.log('Found valid entry in memory');
        } else {
          shareStorage.delete(shareId);
          console.log('Memory entry expired and deleted');
        }
      } else {
        console.log('Entry not found in memory');
      }
    }
    
    if (!shareData) {
      console.log('No share data found');
      return NextResponse.json({ error: 'Share link not found or expired' }, { status: 404 });
    }

    console.log('Returning share data successfully');
    return NextResponse.json({ 
      success: true, 
      data: shareData 
    });

  } catch (error) {
    console.error('Error retrieving share data:', error);
    return NextResponse.json({ error: 'Failed to retrieve share data' }, { status: 500 });
  }
} 