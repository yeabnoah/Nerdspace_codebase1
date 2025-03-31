import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all categories
export const GET = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const categories = await prisma.communityCategory.findMany({
      include: { communities: true },
    });

    return NextResponse.json(
      { message: "categories fetched successfully", data: categories },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// POST create a new category
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
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { message: "Invalid category name" },
        { status: 400 },
      );
    }

    const category = await prisma.communityCategory.create({
      data: { name: body.name },
    });

    return NextResponse.json(
      { message: "category created successfully", data: category },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// PUT update an existing category
export const PUT = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const body = await request.json();
    if (!body.id || !body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { message: "Invalid category ID or name" },
        { status: 400 },
      );
    }

    const updatedCategory = await prisma.communityCategory.update({
      where: { id: body.id },
      data: { name: body.name },
    });

    return NextResponse.json(
      { message: "category updated successfully", data: updatedCategory },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// DELETE a category
export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    await prisma.communityCategory.delete({
      where: { id: body.id },
    });

    return NextResponse.json(
      { message: "category deleted successfully" },
      { status: 204 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
