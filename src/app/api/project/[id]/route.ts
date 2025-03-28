import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        _count: true,
        user: true,
        updates: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: project,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

const productUpdateSchema = z.object({
  image: z.string(),
  title: z.string(),
  content: z.string(),
});

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
    const body = await req.json();

    const validation = productUpdateSchema.safeParse(body);

    if (validation.error || !validation.success) {
      return NextResponse.json(
        {
          message: "validation error",
          error: validation.error.message,
        },
        { status: 402 },
      );
    }

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
        title: body.title,
        image: body.image,
        content: body.content,
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

export const DELETE = async (
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
    const updateId = await req.nextUrl.searchParams.get("updateId");

    if (!updateId) {
      return NextResponse.json(
        {
          message: "please select project",
        },
        { status: 400 },
      );
    }

    const projectUpdate = await prisma.projectUpdate.findFirst({
      where: {
        id: updateId as string,
        projectId: id,
        userId: session.user.id,
      },
    });

    if (!projectUpdate) {
      return NextResponse.json(
        {
          message:
            "Unauthorized | Update does not belong to the user or does not exist",
        },
        { status: 403 },
      );
    }

    await prisma.projectUpdate.delete({
      where: {
        id: updateId,
      },
    });

    return NextResponse.json(
      {
        message: "Project update deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting project update:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
};
