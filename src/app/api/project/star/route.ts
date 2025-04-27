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

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const existingStar = await prisma.projectStar.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingStar) {
      await prisma.projectStar.delete({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      });
      return NextResponse.json({ message: "Star removed" });
    }

    // Create the star
    await prisma.projectStar.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    // Create notification for project owner
    if (project.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "PROJECT_STAR",
          message: "",
          user: {
            connect: { id: project.userId },
          },
          actor: {
            connect: { id: session.user.id },
          },
          project: {
            connect: { id: projectId },
          },
        },
      });
    }

    return NextResponse.json({ message: "Project starred" });
  } catch (error) {
    console.error("Error starring project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Please provide projectId" },
        { status: 400 },
      );
    }

    const isStarred = await prisma.projectStar.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    return NextResponse.json({ isStarred: !!isStarred });
  } catch (error) {
    console.error("Error fetching star status:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
