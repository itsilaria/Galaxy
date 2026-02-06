import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, position, color, language } = body;

    if (!text || !position || !color || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const secret = {
      id: `secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      position,
      color,
      timestamp: Date.now(),
      language,
    };

    // Salva il segreto
    await redis.hset('secrets', { [secret.id]: JSON.stringify(secret) });

    return NextResponse.json({ success: true, secret });
  } catch (error) {
    console.error('Error saving secret:', error);
    return NextResponse.json({ error: 'Failed to save secret' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Recupera tutti i segreti
    const secretsObj = await redis.hgetall('secrets');
    
    if (!secretsObj) {
      return NextResponse.json({ secrets: [] });
    }

    const secrets = Object.values(secretsObj).map((s) => JSON.parse(s as string));
    
    return NextResponse.json({ secrets });
  } catch (error) {
    console.error('Error fetching secrets:', error);
    return NextResponse.json({ error: 'Failed to fetch secrets' }, { status: 500 });
  }
}
