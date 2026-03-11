import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const secrets = await redis.lrange("secrets", 0, -1);
    const parsed = secrets.map((s) => {
      if (typeof s === 'string') {
        try {
          return JSON.parse(s);
        } catch {
          return s;
        }
      }
      return s;
    });
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Errore fetch secrets:", err);
    return NextResponse.json({ error: "Errore fetch secrets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let newSecret = body;
    if (!newSecret.id) {
      newSecret = {
        id: Date.now().toString(),
        text: newSecret.text,
        language: newSecret.language || 'en',
        timestamp: Date.now(),
        position: [
          Math.random() * 10 - 5,
          Math.random() * 5,
          Math.random() * 10 - 5,
        ],
      };
    }

    await redis.rpush("secrets", JSON.stringify(newSecret));
    return NextResponse.json(newSecret, { status: 201 });
  } catch (err) {
    console.error("Errore save secret:", err);
    return NextResponse.json({ error: "Errore save secret" }, { status: 500 });
  }
}
