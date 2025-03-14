import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();

    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }
    const cursor = request.nextUrl.searchParams.get("cursor") || null;
    const limit = 5;

    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
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
