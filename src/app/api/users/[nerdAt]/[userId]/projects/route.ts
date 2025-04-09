import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getUserSession();
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const [userProjects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: params.userId,
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
        },
        orderBy: {
          id: "desc",
        },
        take: limit + 1,
      }),
      prisma.project.count({
        where: {
          userId: params.userId,
        },
      }),
    ]);

    const hasNextPage = userProjects.length > limit;
    const items = hasNextPage ? userProjects.slice(0, -1) : userProjects;
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
