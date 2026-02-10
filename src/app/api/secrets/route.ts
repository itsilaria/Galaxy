import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function getRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const secrets = await redis.lrange("secrets", 0, -1);
    const parsed = secrets.map((s) => {
      if (typeof s === "string") {
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
    console.error("Error fetching secrets:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();

    let newSecret = body;
    if (!newSecret.id) {
      newSecret = {
        id: Date.now().toString(),
        text: newSecret.text,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30,
        ],
      };
    }

    await redis.rpush("secrets", JSON.stringify(newSecret));
    return NextResponse.json(newSecret, { status: 201 });
  } catch (err) {
    console.error("Error saving secret:", err);
    return NextResponse.json({ error: "Error saving secret" }, { status: 500 });
  }
}
