import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  categoryId: z.string().optional(),
});

export const GET = async (request: NextRequest) => {
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

    const groups = await prisma.group.findMany({
      include: {
        creator: true,
        members: true,
        posts: true,
      },
    });

    return NextResponse.json(
      {
        message: "Groups fetched successfully",
        data: groups,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, description, categoryId, image } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Invalid group name" },
        { status: 400 },
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Invalid group description" },
        { status: 400 },
      );
    }

    if (categoryId) {
      const categoryExists = await prisma.groupCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { message: `Invalid category ID: ${categoryId}` },
          { status: 400 },
        );
      }
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        categoryId: categoryId || null,
        image: image || null,
        creator: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json(
      { message: "Group created successfully", data: newGroup },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
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

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        {
          message: "Group ID is required",
        },
        { status: 400 },
      );
    }

    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
      return NextResponse.json(
        {
          message: "Group not found",
        },
        { status: 404 },
      );
    }

    if (group.creatorId !== session.user.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this group",
        },
        { status: 403 },
      );
    }

    await prisma.group.delete({ where: { id } });

    return NextResponse.json(
      {
        message: "Group deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { id, name, description, image, categoryId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Group ID is required" },
        { status: 400 },
      );
    }

    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    if (group.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this group" },
        { status: 403 },
      );
    }

    if (categoryId) {
      const categoryExists = await prisma.groupCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { message: `Invalid category ID: ${categoryId}` },
          { status: 400 },
        );
      }
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name,
        description,
        image,
        categoryId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Group updated successfully",
        group: updatedGroup,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
