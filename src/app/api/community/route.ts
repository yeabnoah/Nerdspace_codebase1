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

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    const communities = await prisma.community.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        creator: true,
        members: true,
        posts: true,
      },
    });

    const hasMore = communities.length > limit;
    if (hasMore) {
      communities.pop();
    }

    return NextResponse.json(
      {
        message: "Communities fetched successfully",
        data: communities,
        hasMore,
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
        { message: "Invalid community name" },
        { status: 400 },
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Invalid community description" },
        { status: 400 },
      );
    }

    if (categoryId) {
      const categoryExists = await prisma.communityCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { message: `Invalid category ID: ${categoryId}` },
          { status: 400 },
        );
      }
    }

    const newCommunity = await prisma.community.create({
      data: {
        name,
        description,
        image: image || null,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        creator: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json(
      { message: "Community created successfully", data: newCommunity },
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
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { id, name, description, image, categoryId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Community ID is required" },
        { status: 400 },
      );
    }

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) {
      return NextResponse.json(
        { message: "Community not found" },
        { status: 404 },
      );
    }

    if (community.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this community" },
        { status: 403 },
      );
    }

    if (categoryId) {
      const categoryExists = await prisma.communityCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { message: `Invalid category ID: ${categoryId}` },
          { status: 400 },
        );
      }
    }

    const updatedCommunity = await prisma.community.update({
      where: { id },
      data: {
        name,
        description,
        image,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
