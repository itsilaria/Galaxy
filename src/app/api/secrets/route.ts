import { NextRequest, NextResponse } from "next/server";

// In-memory storage as fallback when Redis is not available
let memorySecrets: any[] = [
  {
    id: "1",
    text: "Sometimes I wonder if the stars are watching us back...",
    position: [-2, 2, 1],
    timestamp: Date.now() - 86400000
  },
  {
    id: "2", 
    text: "I've never told anyone this, but I still believe in magic.",
    position: [3, 1, -2],
    timestamp: Date.now() - 172800000
  },
  {
    id: "3",
    text: "Every night I look up and feel less alone.",
    position: [0, 3, 0],
    timestamp: Date.now() - 259200000
  },
  {
    id: "4",
    text: "My biggest secret? I'm actually happy.",
    position: [-4, 1.5, 3],
    timestamp: Date.now() - 345600000
  },
  {
    id: "5",
    text: "I wrote a letter to my future self and hid it among the stars.",
    position: [2, 4, -1],
    timestamp: Date.now() - 432000000
  }
];

// Try to use Redis if available
let redis: any = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require("@upstash/redis");
    redis = Redis.fromEnv();
  }
} catch (e) {
  console.log("Redis not available, using in-memory storage");
}

export async function GET() {
  try {
    if (redis) {
      const secrets = await redis.lrange("secrets", 0, -1);
      const parsed = secrets.map((s: any) => {
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
    }
    
    // Return mock data if no Redis
    return NextResponse.json(memorySecrets);
  } catch (err) {
    console.error("Error fetching secrets:", err);
    // Return mock data on error
    return NextResponse.json(memorySecrets);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newSecret = {
      id: Date.now().toString(),
      text: body.text,
      language: body.language || 'en',
      timestamp: Date.now(),
      position: body.position || [
        Math.random() * 10 - 5,
        Math.random() * 5,
        Math.random() * 10 - 5,
      ],
    };

    if (redis) {
      await redis.rpush("secrets", JSON.stringify(newSecret));
    } else {
      memorySecrets.push(newSecret);
    }
    
    return NextResponse.json(newSecret, { status: 201 });
  } catch (err) {
    console.error("Error saving secret:", err);
    return NextResponse.json({ error: "Error saving secret" }, { status: 500 });
  }
}
