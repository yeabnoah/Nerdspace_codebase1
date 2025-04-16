import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop() as string;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            following: true,
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
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const modifiedPost = {
      ...post,
      user: {
        ...post.user,
        isFollowingAuthor: post.user.following.length > 0,
      },
    };

    return NextResponse.json(
      {
        data: modifiedPost,
        message: "Post fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
