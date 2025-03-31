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

    const existingLike = await prisma.projectFollow.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingLike) {
      await prisma.projectFollow.delete({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      });
      return NextResponse.json({ message: "Follow removed" });
    }

    await prisma.projectFollow.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: "Follow added" });
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

    const isFollowing = await prisma.projectFollow.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!isFollowing }); // Correctly return follow status
  } catch (error) {
    console.error("Error fetching follow status:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
