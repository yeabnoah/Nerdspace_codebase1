import { NextResponse } from "next/server";

import getUserSession from "@/functions/get-user";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
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

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: true, // User who receives the notification
        actor: true, // User who triggered the notification
        post: {
          include: {
            user: true,
            media: true,
          },
        },
        comment: {
          include: {
            user: true,
            post: true,
          },
        },
        project: {
          include: {
            user: true,
          },
        },
        community: {
          include: {
            creator: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
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

    const {
      type,
      actorId,
      postId,
      commentId,
      projectId,
      communityId,
      message,
    } = await request.json();

    const actor = actorId
      ? await prisma.user.findUnique({
          where: { id: actorId },
          select: { name: true },
        })
      : null;

    let personalizedMessage = message;
    if (actor) {
      switch (type) {
        case "POST_LIKE":
          personalizedMessage = `${actor.name} liked your post`;
          break;
        case "POST_COMMENT":
          personalizedMessage = `${actor.name} commented on your post`;
          break;
        case "FOLLOW":
          personalizedMessage = `${actor.name} started following you`;
          break;
        case "PROJECT_STAR":
          personalizedMessage = `${actor.name} starred your project`;
          break;
        case "PROJECT_FOLLOW":
          personalizedMessage = `${actor.name} is following your project`;
          break;
        default:
          personalizedMessage = message || "";
      }
    }

    const notificationData: any = {
      type,
      message: personalizedMessage,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    };

    if (actorId) {
      notificationData.actor = {
        connect: { id: actorId },
      };
    }

    if (postId) {
      notificationData.post = {
        connect: { id: postId },
      };
    }

    if (commentId) {
      notificationData.comment = {
        connect: { id: commentId },
      };
    }

    if (projectId) {
      notificationData.project = {
        connect: { id: projectId },
      };
    }

    if (communityId) {
      notificationData.community = {
        connect: { id: communityId },
      };
    }

    const notification = await prisma.notification.create({
      data: notificationData,
    });

    return NextResponse.json(notification, { status: 200 });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest) => {
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

    // Mark all notifications as read for the user
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(
      { message: "Notifications marked as read" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
