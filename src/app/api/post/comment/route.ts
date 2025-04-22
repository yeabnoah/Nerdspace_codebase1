import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import commentSchema from "@/validation/comment.validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json(
        { message: "Post ID and content are required" },
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

    // Create the comment
    const comment = await prisma.postComment.create({
      data: {
        content,
        userId: session.user.id,
        postId: postId,
      },
    });

    // Create notification for post owner
    if (post.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "POST_COMMENT",
          message: content,
          user: {
            connect: { id: post.userId },
          },
          actor: {
            connect: { id: session.user.id },
          },
          post: {},
          comment: {
            connect: { id: comment.id },
          },
        },
      });
    }

    return NextResponse.json({ message: "Comment created", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    const postId = await request.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        {
          message: "postId query parameter is required",
        },
        { status: 401 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const allComments = await prisma.postComment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: true,
        replies: true,
        parent: true,
      },
    });

    return NextResponse.json(
      {
        data: allComments,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating comment:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const body = await req.json();

    const parsedBody = commentSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: parsedBody.error.errors,
        },
        { status: 400 },
      );
    }

    const { commentId, content } = body;

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "unauthorized | not allowed to edit this comment",
        },
        { status: 403 },
      );
    }

    const updatedComment = await prisma.postComment.update({
      where: { id: commentId },
      data: { content: content },
    });

    return NextResponse.json(
      {
        data: updatedComment,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating comment:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    const commentId = await request.nextUrl.searchParams.get("commentId");

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const comment = await prisma.postComment.findUnique({
      where: { id: commentId as string },
    });

    if (!comment || comment.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "unauthorized | not allowed to delete this comment",
        },
        { status: 403 },
      );
    }

    await prisma.postComment.delete({
      where: { id: commentId as string },
    });

    return NextResponse.json(
      {
        message: "Comment deleted successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
