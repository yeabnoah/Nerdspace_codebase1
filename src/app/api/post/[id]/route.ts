import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getUserSession();
    const postId = params.id;

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            nerdAt: true,
          },
        },
        media: true,
        likes: {
          where: {
            userId: session?.user?.id,
          },
        },
        bookmarks: {
          where: {
            userId: session?.user?.id,
          },
        },
        postcomments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                nerdAt: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    nerdAt: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            postcomments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}
