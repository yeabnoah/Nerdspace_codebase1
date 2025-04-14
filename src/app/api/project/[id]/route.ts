import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
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

    const cursor = req.nextUrl.searchParams.get("cursor");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "3", 10); // Default to 3 updates per page

    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        _count: true,
        user: true,
        stars: true,
        followers: true,
        reviews: {
          include: { user: true },
        },
        updates: {
          take: limit,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: "desc" },
          include: { likes: true, comments: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const nextCursor =
      project.updates.length === limit
        ? project.updates[project.updates.length - 1].id
        : null;

    return NextResponse.json(
      {
        data: { ...project, updates: project.updates },
        nextCursor, // Include nextCursor in the response
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

const productUpdateSchema = z.object({
  image: z.string(),
  title: z.string(),
  content: z.string(),
});

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

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id, // Ensure the user owns the project
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Unauthorized | Project does not belong to the user" },
        { status: 403 },
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
