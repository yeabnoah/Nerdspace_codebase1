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

    const { userId, postId } = result.data;

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ message: "Like removed" }, { status: 200 });
    }

    await prisma.like.create({
      data: { userId, postId },
    });

    return NextResponse.json({ message: "Liked post" }, { status: 201 });
  } catch (err) {
    console.error("Error updating comment:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
