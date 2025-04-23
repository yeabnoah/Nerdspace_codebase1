import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    // Extract userId from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const userId = pathParts[pathParts.length - 2]; // Get the userId from the path

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: userId,
          ...(cursor && {
            id: {
              lt: cursor,
            },
          }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              stars: true,
              followers: true,
              reviews: true,
              updates: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit + 1,
      }),
      prisma.project.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const hasNextPage = projects.length > limit;
    const items = hasNextPage ? projects.slice(0, -1) : projects;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return NextResponse.json({
      data: items,
      pagination: {
        nextCursor,
        hasNextPage,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch user projects" },
      { status: 500 },
    );
  }
}
