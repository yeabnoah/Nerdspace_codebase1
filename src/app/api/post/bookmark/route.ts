import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import bookmarkSchema from "@/validation/bookmark.validation";
import { NextResponse } from "next/server";

export const POST = async (req: NextResponse) => {
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
    const result = bookmarkSchema.safeParse(body);

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

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, postId },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return NextResponse.json(
        { message: "Bookmark removed" },
        { status: 200 },
      );
    }

    await prisma.bookmark.create({
      data: { userId, postId },
    });

    return NextResponse.json({ message: "Bookmarked post" }, { status: 201 });
  } catch (err) {
    console.error("Error updating comment:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
