import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const secrets = await redis.lrange("secrets", 0, -1);
      res.status(200).json(secrets.map((s) => JSON.parse(s)));
    } catch (err) {
      res.status(500).json({ error: "Errore fetch secrets" });
    }
  } else if (req.method === "POST") {
    try {
      const { text } = req.body;
      const newSecret = { id: Date.now().toString(), text };
      await redis.rpush("secrets", JSON.stringify(newSecret));
      res.status(201).json(newSecret);
    } catch (err) {
      res.status(500).json({ error: "Errore save secret" });
    }
  } else {
    res.status(405).end();
  }
}
