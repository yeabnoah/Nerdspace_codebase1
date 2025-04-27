import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 401 },
      );
    }

    const { followedUserId, message } = await request.json();

    if (!followedUserId) {
      return NextResponse.json(
        {
          message: "Followed user ID is required",
        },
        { status: 400 },
      );
    }

    const actorId = session.user.id;

    // Don't notify if user is following themselves (edge case)
    if (followedUserId === actorId) {
      return NextResponse.json(
        {
          message: "User cannot follow themselves",
        },
        { status: 200 },
      );
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorId },
      select: { name: true },
    });

    let personalizedMessage = message || "";
    if (actor) {
      personalizedMessage = `${actor.name} started following you`;
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        type: "FOLLOW",
        message: personalizedMessage,
        user: {
          connect: {
            id: followedUserId,
          },
        },
        actor: {
          connect: {
            id: actorId,
          },
        },
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating follow notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
