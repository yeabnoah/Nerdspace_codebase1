import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
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

    const { id } = params;
    const projectUpdates = await prisma.projectUpdate.findMany({
      where: {
        projectId: id,
      },
    });

    return NextResponse.json({
      data: projectUpdates,
    });
  } catch (error) {
    console.error("Error creating project update:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
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

    const { id } = params;
    const { image, title, content } = await req.json();

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Unauthorized | Project does not belong to the user",
        },
        { status: 403 },
      );
    }

    const newUpdate = await prisma.projectUpdate.create({
      data: {
        projectId: id,
        title,
        image,
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      data: newUpdate,
    });
  } catch (error) {
    console.error("Error creating project update:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
};
