import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/validation/post.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json(
      {
        data: posts,
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
