import { NextRequest, NextResponse } from "next/server";
import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import likeSchema from "@/validation/like.validation";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: postId,
          },
        },
      });
      return NextResponse.json({ message: "Like removed" });
    }

    // Create the like
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId: postId,
      },
    });

    // Create notification for post owner
    if (post.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "POST_LIKE",
          message: "",
          user: {
            connect: { id: post.userId },
          },
          actor: {
            connect: { id: session.user.id },
          },
          post: {
            connect: { id: postId },
          },
        },
      });
    }

    return NextResponse.json({ message: "Post liked" });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
