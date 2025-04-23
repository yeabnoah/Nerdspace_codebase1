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

    const { followingId } = await request.json();
    if (!followingId) {
      return NextResponse.json(
        { message: "Following ID is required" },
        { status: 400 },
      );
    }

    // Make sure users can't follow themselves
    if (followingId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 },
      );
    }

    // Make sure the target user exists
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

    if (existingFollow) {
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

    // Create the follow
    await prisma.follows.create({
      data: {
        followerId: session.user.id,
        followingId: followingId,
      },
    });

    // Create notification for the user being followed
    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        message: "", // Will be personalized in the notification API
        user: {
          connect: { id: followingId }, // User being followed receives the notification
        },
        actor: {
          connect: { id: session.user.id }, // User who followed
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
