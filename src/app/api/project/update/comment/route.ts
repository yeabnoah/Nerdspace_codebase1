import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const updateId = req.nextUrl.searchParams.get("updateId");
    const body = await req.json();
    const parsedBody = commentSchema.safeParse(body);

    if (!updateId || !parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsedBody.error?.format() },
        { status: 400 },
      );
    }

    const newComment = await prisma.projectUpdateComment.create({
      data: {
        userId: session.user.id,
        updateId: updateId,
        content: parsedBody.data.content,
      },
    });

    return NextResponse.json({ data: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const commentId = req.nextUrl.searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { message: "Please provide commentId" },
        { status: 400 },
      );
    }

    const comment = await prisma.projectUpdateComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this comment" },
        { status: 403 },
      );
    }

    await prisma.projectUpdateComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const comments = await prisma.projectUpdateComment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const commentId = req.nextUrl.searchParams.get("commentId");
    const body = await req.json();
    const parsedBody = commentSchema.safeParse(body);

    if (!commentId || !parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsedBody.error?.format() },
        { status: 400 },
      );
    }

    const comment = await prisma.projectUpdateComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this comment" },
        { status: 403 },
      );
    }

    const updatedComment = await prisma.projectUpdateComment.update({
      where: { id: commentId },
      data: { content: parsedBody.data.content },
    });

    return NextResponse.json({ data: updatedComment }, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
