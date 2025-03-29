import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { projectId, content } = await request.json();
    const review = await prisma.projectReview.create({
      data: {
        userId: session.user.id,
        projectId,
        content,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating project review:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 401 },
      );
    }

    const { reviewId, content } = await request.json();
    if (!reviewId || !content) {
      return NextResponse.json(
        { message: "Review ID and content are required" },
        { status: 400 },
      );
    }

    const review = await prisma.projectReview.update({
      where: { id: reviewId },
      data: { content },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Error updating project review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 401 },
      );
    }

    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID is required" },
        { status: 400 },
      );
    }

    await prisma.projectReview.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { message: "Project review deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting project review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
};
