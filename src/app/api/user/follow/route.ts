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

    // Support both query parameters and request body
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const action = searchParams.get("action") as "follow" | "unfollow" | null;

    // If query params aren't present, try to get from request body
    let followingId: string | null = null;

    // Only parse request body if content type indicates JSON and body exists
    if (request.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await request.json();
        followingId = body.followingId || null;
      } catch (err) {
        // Silent fail on JSON parse error
      }
    }

    // Use userId from query params as fallback for followingId
    followingId = followingId || userId || null;

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

    // If an explicit action is provided, use it
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

    // If we get here, we're either explicitly following or toggling to follow
    if (existingFollow) {
      return NextResponse.json({
        message: "You are already following this user",
      });
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
