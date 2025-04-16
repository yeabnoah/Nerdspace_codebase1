import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();
    const userId = request.nextUrl.searchParams.get("userId");
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = 5;

    if (!userId) {
      return NextResponse.json(
        {
          message: "userId is required",
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

    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
        access: "public",
      },
      include: {
        user: {
          include: {
            following: {
              where: { followerId: session.user.id },
              select: { id: true },
            },
          },
        },
        likes: true,
        bookmarks: true,
        media: true,
        project: {
          include: {
            _count: true,
          },
        },
        _count: {
          select: {
            likes: true,
            bookmarks: true,
            postcomments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const modifiedPosts = posts.map((post) => ({
      ...post,
      user: {
        ...post.user,
        isFollowingAuthor: post.user.following.length > 0,
      },
    }));

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return NextResponse.json(
      {
        data: modifiedPosts,
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
