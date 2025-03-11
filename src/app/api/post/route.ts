import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/validation/post.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") || null;
    const limit = 5;

    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return NextResponse.json(
      {
        data: posts,
        nextCursor: nextCursor,
        message: "posts fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { content }: { content: string } = await req.json();
    const session = await getUserSession();

    const validateContent = postSchema.safeParse({ content });

    if (validateContent.error) {
      return Response.json(
        {
          message: "Plase provide the right parameters",
        },
        { status: 403 },
      );
    }

    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        content: content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: newPost,
        id: session.user.id as string | "user",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while posting post",
        error: error,
      },
      { status: 500 },
    );
  }
};
