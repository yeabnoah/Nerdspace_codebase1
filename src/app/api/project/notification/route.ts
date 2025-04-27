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

    const { type, projectId, message } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        {
          message: "Project ID is required",
        },
        { status: 400 },
      );
    }

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    const actorId = session.user.id;
    const actor = await prisma.user.findUnique({
      where: { id: actorId },
      select: { name: true },
    });

    // Get the project owner
    const ownerId = project.userId;

    // Don't notify if owner is the same as the actor
    if (ownerId === actorId) {
      return NextResponse.json(
        {
          message: "User cannot notify themselves",
        },
        { status: 200 },
      );
    }

    let personalizedMessage = message || "";
    if (actor) {
      switch (type) {
        case "PROJECT_STAR":
          personalizedMessage = `${actor.name} starred your project ${project.name}`;
          break;
        case "PROJECT_FOLLOW":
          personalizedMessage = `${actor.name} is following your project ${project.name}`;
          break;
        case "PROJECT_RATING":
          personalizedMessage = `${actor.name} rated your project ${project.name}`;
          break;
        case "PROJECT_REVIEW":
          personalizedMessage = `${actor.name} reviewed your project ${project.name}`;
          break;
        default:
          personalizedMessage = message || "";
      }
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        type,
        message: personalizedMessage,
        user: {
          connect: {
            id: ownerId,
          },
        },
        actor: {
          connect: {
            id: actorId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Get all notifications for a specific project
export const GET = async (request: NextRequest) => {
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

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          message: "Project ID is required",
        },
        { status: 400 },
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        projectId,
        userId: session.user.id,
      },
      include: {
        user: true,
        actor: true,
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching project notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
