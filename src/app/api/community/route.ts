import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCommunitySchema = z.object({
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

    const communities = await prisma.community.findMany({
      include: {
        creator: true,
        members: true,
        posts: true,
      },
    });

    return NextResponse.json(
      {
        message: "Communities fetched successfully",
        data: communities,
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
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, description, image, categoryId } =
      createCommunitySchema.parse(body);

    const existingCommunity = await prisma.community.findUnique({
      where: { name },
    });
    if (existingCommunity) {
      return NextResponse.json(
        {
          message: "Community with this name already exists",
        },
        { status: 400 },
      );
    }

    const newCommunity = await prisma.community.create({
      data: {
        name,
        description,
        image,
        categoryId,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Community created successfully",
        community: newCommunity,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 },
    );
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
          message: "Community ID is required",
        },
        { status: 400 },
      );
    }

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) {
      return NextResponse.json(
        {
          message: "Community not found",
        },
        { status: 404 },
      );
    }

    if (community.creatorId !== session.user.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this community",
        },
        { status: 403 },
      );
    }

    await prisma.community.delete({ where: { id } });

    return NextResponse.json(
      {
        message: "Community deleted successfully",
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
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const { id, name, description, image, categoryId } = await request.json();
    if (!id) {
      return NextResponse.json(
        {
          message: "Community ID is required",
        },
        { status: 400 },
      );
    }

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) {
      return NextResponse.json(
        {
          message: "Community not found",
        },
        { status: 404 },
      );
    }

    if (community.creatorId !== session.user.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to update this community",
        },
        { status: 403 },
      );
    }

    const updatedCommunity = await prisma.community.update({
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
        message: "Community updated successfully",
        community: updatedCommunity,
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
