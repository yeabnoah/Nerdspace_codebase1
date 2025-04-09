import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
          ...(cursor && {
            post: {
              createdAt: {
                lt: new Date(cursor),
              },
            },
          }),
        },
        include: {
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  bio: true,
                  nerdAt: true,
                  coverImage: true,
                },
              },
              media: true,
              likes: true,
              bookmarks: true,
              postcomments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          post: {
            createdAt: "desc",
          },
        },
        take: limit + 1,
      }),
      prisma.bookmark.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    const hasNextPage = bookmarks.length > limit;
    const items = hasNextPage ? bookmarks.slice(0, -1) : bookmarks;
    const nextCursor = hasNextPage
      ? items[items.length - 1].post.createdAt.toISOString()
      : null;

    return NextResponse.json({
      data: items.map((bookmark) => bookmark.post),
      pagination: {
        nextCursor,
        hasNextPage,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}
