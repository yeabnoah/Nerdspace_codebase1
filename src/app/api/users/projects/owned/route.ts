import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const [ownedProjects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: session.user.id,
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
          userId: session.user.id,
        },
      }),
    ]);

    const hasNextPage = ownedProjects.length > limit;
    const items = hasNextPage ? ownedProjects.slice(0, -1) : ownedProjects;
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
    console.error("Error fetching owned projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch owned projects" },
      { status: 500 },
    );
  }
}
