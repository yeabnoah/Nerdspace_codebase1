import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ error: "Post ID and User ID are required" });
  }

  try {
    if (req.method === "POST") {
      const like = await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
      return res.status(200).json(like);
    } else if (req.method === "DELETE") {
      // Unlike a post
      const unlike = await prisma.postLike.deleteMany({
        where: {
          postId,
          userId,
        },
      });
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      res.setHeader("Allow", ["POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
