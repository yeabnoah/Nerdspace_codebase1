import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const userId = pathParts[pathParts.length - 1];

    console.log("Fetching counts for userId:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    // Debug: Check all follows for this user
    const allFollows = await prisma.follows.findMany({
      where: {
        OR: [{ followerId: userId }, { followingId: userId }],
      },
    });
    console.log("All follows for user:", allFollows);

    const [followersCount, followingCount] = await Promise.all([
      prisma.follows.count({
        where: {
          followingId: userId,
        },
      }),
      prisma.follows.count({
        where: {
          followerId: userId,
        },
      }),
    ]);

    console.log("Counts result:", { followersCount, followingCount });

    return NextResponse.json({
      followers: followersCount,
      following: followingCount,
    });
  } catch (error) {
    console.error("Error fetching follow counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow counts" },
      { status: 500 },
    );
  }
}
