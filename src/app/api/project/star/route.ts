import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Please provide projectId" },
        { status: 400 },
      );
    }

    const existingLike = await prisma.projectStar.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingLike) {
      await prisma.projectStar.delete({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      });
      return NextResponse.json({ message: "star removed" });
    }

    await prisma.projectStar.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: "star added" });
  } catch (error) {
    console.error("Error creating project:", error);
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
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
