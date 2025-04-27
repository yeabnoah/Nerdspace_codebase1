import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const currentUserId = session.user.id;

    // Get total count of users (excluding current user)
    const totalUsers = await prisma.user.count({
      where: {
        id: { not: currentUserId },
      },
    });

    // Get users that the current user is following
    const userFollows = await prisma.follows.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = userFollows.map((follow) => follow.followingId);

    // If user has followed everyone, return empty with message
    if (followingIds.length >= totalUsers - 1) {
      return NextResponse.json(
        {
          data: [],
          nextCursor: null,
          message: "You have followed all available users!",
        },
        { status: 200 },
      );
    }

    // Then get recommended users with better ordering - use a more reliable approach
    const users = await prisma.user.findMany({
      where: {
        AND: [{ id: { not: currentUserId } }, { id: { notIn: followingIds } }],
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            Project: {
              where: { access: "public" },
            },
          },
        },
        followers: {
          where: {
            followerId: currentUserId,
          },
          select: {
            followerId: true,
          },
        },
      },
      take: 12, // Increased to ensure we have enough users
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [
        {
          followers: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
    });

    // Extra check - if no users found despite our checks, return a helpful message
    if (users.length === 0) {
      return NextResponse.json(
        {
          data: [],
          nextCursor: null,
          message:
            "No recommendations available right now. Please try again later.",
        },
        { status: 200 },
      );
    }

    // Transform the data to include isFollowingAuthor
    const transformedUsers = users.map((user) => ({
      ...user,
      isFollowingAuthor: user.followers.length > 0,
      followers: undefined,
    }));

    const nextCursor = users.length === 12 ? users[11].id : null;

    return NextResponse.json(
      {
        data: transformedUsers,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error in user recommendation:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
