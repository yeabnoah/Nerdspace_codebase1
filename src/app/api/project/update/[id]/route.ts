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

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const id = pathParts[pathParts.length - 1]; // Assuming the last part is the id

    const projectUpdates = await prisma.projectUpdate.findMany({
      where: {
        projectId: id,
      },
      include: {
        likes: true,
        comments: {
          include: {
            user: true,
          },
        },
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

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const id = pathParts[pathParts.length - 1]; // Assuming the last part is the id

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

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const id = pathParts[pathParts.length - 1]; // Assuming the last part is the id

    const update = await prisma.projectUpdate.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!update) {
      return NextResponse.json(
        { message: "Unauthorized | Update does not belong to the user" },
        { status: 403 },
      );
    }

    await prisma.projectUpdate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Update deleted successfully" });
  } catch (error) {
    console.error("Error deleting update:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
