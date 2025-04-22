import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import likeSchema from "@/validation/like.validation";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const result = likeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: result.error.errors,
        },
        { status: 400 },
      );
    }

    const { postId } = result.data;
    const userId = session.user.id;

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ message: "Like removed" }, { status: 200 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await prisma.like.create({
      data: { userId, postId },
    });

    if (post.userId !== userId) {
      await prisma.notification.create({
        data: {
          type: "POST_LIKE",
          message: "",
          user: {
            connect: { id: post.userId },
          },
          actor: {
            connect: { id: userId },
          },
          post: {
            connect: { id: postId },
          },
        },
      });
    }

    return NextResponse.json({ message: "Liked post" }, { status: 201 });
  } catch (err) {
    console.error("Error updating like:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
