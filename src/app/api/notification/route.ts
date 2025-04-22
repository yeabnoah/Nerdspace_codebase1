import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { createNotificationSchema } from "@/lib/validations/notification";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: notifications,
        message: "notifications fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
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

    const body = await request.json();

    const validationResult = createNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { type, postId, commentId, followerId } = validationResult.data;

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        postId,
        commentId,
        followerId,
      },
    });

    return NextResponse.json(
      {
        data: notification,
        message: "notification created successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
