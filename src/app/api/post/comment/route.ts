import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  postId: z.string(),
  content: z.string(),
  parentId: z.string().optional(),
});

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
