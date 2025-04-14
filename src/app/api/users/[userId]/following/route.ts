import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const userId = pathParts[pathParts.length - 1]; // Assuming the last part is the userId

    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const [following, total] = await Promise.all([
      prisma.follows.findMany({
        where: {
          followerId: userId,
          ...(cursor && {
            createdAt: {
              lt: new Date(cursor),
            },
          }),
        },
        include: {
          following: {
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
          followerId: userId,
        },
      }),
    ]);

    const hasNextPage = following.length > limit;
    const items = hasNextPage ? following.slice(0, -1) : following;
    const nextCursor = hasNextPage
      ? items[items.length - 1].createdAt.toISOString()
      : null;

    return NextResponse.json({
      data: items.map((follow) => follow.following),
      pagination: {
        nextCursor,
        hasNextPage,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 },
    );
  }
}
