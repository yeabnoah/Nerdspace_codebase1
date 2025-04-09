import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

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
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      data: bookmarks.map((bookmark) => bookmark.post),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
