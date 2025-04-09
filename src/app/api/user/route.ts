import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const userId = req.nextUrl.searchParams.get("userId");
    const nerdAt = req.nextUrl.searchParams.get("nerdAt");

    if (!userId && !nerdAt) {
      return NextResponse.json(
        {
          message: "userId or nerdAt is required",
        },
        { status: 400 },
      );
    }

    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: userId ? { id: userId } : { nerdAt: nerdAt! },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        nerdAt: true,
        coverImage: true,
        visualName: true,
        country: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Get the actual counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follows.count({
        where: { followingId: user.id },
      }),
      prisma.follows.count({
        where: { followerId: user.id },
      }),
    ]);

    return NextResponse.json({
      data: {
        ...user,
        _count: {
          followers: followersCount,
          following: followingCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
