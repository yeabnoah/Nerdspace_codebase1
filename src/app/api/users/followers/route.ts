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

    const [followers, total] = await Promise.all([
      prisma.follows.findMany({
        where: {
          followingId: session.user.id,
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
        skip,
        take: limit,
      }),
      prisma.follows.count({
        where: {
          followingId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      data: followers.map((follow) => follow.follower),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
