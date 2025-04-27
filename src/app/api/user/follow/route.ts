import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const action = searchParams.get("action") as "follow" | "unfollow" | null;

    let followingId: string | null = null;

    if (request.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await request.json();
        followingId = body.followingId || null;
      } catch (err) {}
    }

    followingId = followingId || userId || null;

    if (!followingId) {
      return NextResponse.json(
        { message: "Following ID is required" },
        { status: 400 },
      );
    }

    if (followingId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: followingId,
        },
      },
    });

    const shouldUnfollow =
      action === "unfollow" || (existingFollow && action !== "follow");

    if (shouldUnfollow) {
      if (!existingFollow) {
        return NextResponse.json({
          message: "You are not following this user",
        });
      }

      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: followingId,
          },
        },
      });
      return NextResponse.json({ message: "Unfollowed successfully" });
    }

    if (existingFollow) {
      return NextResponse.json({
        message: "You are already following this user",
      });
    }

    await prisma.follows.create({
      data: {
        followerId: session.user.id,
        followingId: followingId,
      },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        message: "",
        user: {
          connect: { id: followingId },
        },
        actor: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      {
        message: "Failed to process follow request",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
};
