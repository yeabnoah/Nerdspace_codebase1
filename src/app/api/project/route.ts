import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import {
  ProjectInterface,
  projectSchema,
} from "@/validation/project.validation";
import { NextRequest, NextResponse } from "next/server";

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

    const body: ProjectInterface = await request.json();
    const validation = projectSchema.safeParse(body);

    if (validation.error || !validation.success) {
      return NextResponse.json(
        {
          message: validation.error.message,
        },
        { status: 400 },
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        name: body.name,
        userId: session.user.id,
      },
    });

    if (existingProject) {
      return NextResponse.json(
        {
          message: "Project name already exists for this user.",
        },
        { status: 400 },
      );
    }

    const newProject = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        userId: session.user.id,
        access: body.access,
        status: body.status,
      },
    });

    return NextResponse.json(
      {
        data: newProject,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: true,
      },
    });

    return NextResponse.json(
      {
        data: projects,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    const id = await request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Project ID is required",
        },
        { status: 400 },
      );
    }

    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const body: ProjectInterface = await request.json();
    const validation = projectSchema.safeParse(body);

    if (validation.error || !validation.success) {
      return NextResponse.json(
        {
          message: validation.error.message,
        },
        { status: 400 },
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        access: body.access,
        status: body.status,
      },
      include: {
        _count: true,
      },
    });

    return NextResponse.json(
      {
        data: updatedProject,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const id = await request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Project ID is required",
        },
        { status: 400 },
      );
    }

    await prisma.project.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Project deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
