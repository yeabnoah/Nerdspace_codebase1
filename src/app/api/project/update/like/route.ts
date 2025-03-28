import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const updateId = req.nextUrl.searchParams.get("updateId");
    if (!updateId) {
      return NextResponse.json(
        { message: "Please provide updateId" },
        { status: 400 },
      );
    }

    const existingLike = await prisma.projectUpdateLike.findUnique({
      where: {
        userId_updateId: {
          userId: session.user.id,
          updateId: updateId,
        },
      },
    });

    if (existingLike) {
      await prisma.projectUpdateLike.delete({
        where: {
          userId_updateId: {
            userId: session.user.id,
            updateId: updateId,
          },
        },
      });
      return NextResponse.json({ message: "Like removed" });
    }

    await prisma.projectUpdateLike.create({
      data: {
        userId: session.user.id,
        updateId: updateId,
      },
    });

    return NextResponse.json({ message: "Like added" });
  } catch (error) {
    console.error("Error handling like operation:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json(
        { message: "Please provide projectId" },
        { status: 400 },
      );
    }

    const likesCount = await prisma.projectUpdateLike.count({
      where: { updateId: projectId },
    });

    return NextResponse.json({ likesCount });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
