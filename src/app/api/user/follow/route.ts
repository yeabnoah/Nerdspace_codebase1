import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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

    const user = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: userId,
      },
    });

    if (user) {
      await prisma.follow.delete({
        where: {
          id: user.id,
        },
      });
    }

    const following = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: userId,
      },
    });

    return NextResponse.json(
      {
        data: following,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
