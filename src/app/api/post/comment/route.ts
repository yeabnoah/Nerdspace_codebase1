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
        { status: 400 },
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
        { status: 400 },
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
