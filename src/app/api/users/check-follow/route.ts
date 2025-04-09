import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get("userIds")?.split(",");

    if (!userIds || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs are required" },
        { status: 400 },
      );
    }

    const follows = await prisma.follows.findMany({
      where: {
        followerId: session.user.id,
        followingId: {
          in: userIds,
        },
      },
      select: {
        followingId: true,
      },
    });

    const followStatus = userIds.reduce(
      (acc, userId) => {
        acc[userId] = follows.some((follow) => follow.followingId === userId);
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return NextResponse.json(followStatus);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
