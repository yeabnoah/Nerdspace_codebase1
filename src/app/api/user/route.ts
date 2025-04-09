import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const userId = await req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "userId is required",
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
      where: {
        id: userId,
      },
      include: {
        posts: true,
        country: true,
        followers: true,
        following: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
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

    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
