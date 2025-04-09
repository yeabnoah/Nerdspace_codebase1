import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const [followers, total] = await Promise.all([
      prisma.follows.findMany({
        where: {
          followingId: userId,
          ...(cursor && {
            createdAt: {
              lt: new Date(cursor),
            },
          }),
        },
        include: {
          follower: {
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
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit + 1,
      }),
      prisma.follows.count({
        where: {
          followingId: userId,
        },
      }),
    ]);

    const hasNextPage = followers.length > limit;
    const items = hasNextPage ? followers.slice(0, -1) : followers;
    const nextCursor = hasNextPage
      ? items[items.length - 1].createdAt.toISOString()
      : null;

    return NextResponse.json({
      data: items.map((follow) => follow.follower),
      pagination: {
        nextCursor,
        hasNextPage,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { error: "Failed to fetch followers" },
      { status: 500 },
    );
  }
}
