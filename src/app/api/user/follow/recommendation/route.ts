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

    // First get users that the current user is following
    const userFollows = await prisma.follows.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = userFollows.map((follow) => follow.followingId);

    // Then get recommended users
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId,
            },
          },
          {
            id: {
              notIn: followingIds,
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            Project: {
              where: {
                access: "public",
              },
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
      take: 10,
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

    // Transform the data to include isFollowingAuthor
    const transformedUsers = users.map((user) => ({
      ...user,
      isFollowingAuthor: user.followers.length > 0,
      followers: undefined, // Remove the followers array from response
    }));

    const nextCursor = users.length === 10 ? users[9].id : null;

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
