import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import commentSchema from "@/validation/comment.validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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
        { status: 401 },
      );
    }

    const { postId, content, parentId } = parsedBody.data;

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const newComment = await prisma.postComment.create({
      data: {
        userId: session.user.id,
        postId: postId,
        content: content,
        parentId: parentId || null,
      },
      include: {
        user: true,
        replies: true,
        parent: true,
      },
    });

    return NextResponse.json(
      {
        data: newComment,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating comment:", err);
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

    const { commentId, content } = body; // Include postId

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
