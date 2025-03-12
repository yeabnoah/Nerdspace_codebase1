import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { id }: { id: string } = await req.json();
    const session = await getUserSession();

    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!post) {
      return Response.json(
        {
          message: "Post not found or you do not have access to it",
        },
        { status: 404 },
      );
    }

    const updatedAccess = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        access: post.access === "public" ? "private" : "public",
      },
    });

    return Response.json(updatedAccess, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "An error occurred",
      },
      { status: 500 },
    );
  }
};
