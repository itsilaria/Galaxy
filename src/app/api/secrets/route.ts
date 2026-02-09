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
      // se il frontend manda solo { text }, creiamo l'oggetto completo
      let newSecret = req.body;

      if (!newSecret.id) {
        newSecret = {
          id: Date.now().toString(),
          text: newSecret.text,
          position: [
            Math.random() * 10 - 5,
            Math.random() * 5,
            Math.random() * 10 - 5,
          ],
        };
      }

      await redis.rpush("secrets", JSON.stringify(newSecret));
      res.status(201).json(newSecret);
    } catch (err) {
      res.status(500).json({ error: "Errore save secret" });
    }
  } else {
    res.status(405).end();
  }
}
