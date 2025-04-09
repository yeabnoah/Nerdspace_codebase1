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

    const [followedProjects, total] = await Promise.all([
      prisma.projectFollow.findMany({
        where: {
          userId: session.user.id,
          ...(cursor && {
            createdAt: {
              lt: new Date(cursor),
            },
          }),
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              status: true,
              category: true,
              access: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
        take: limit + 1,
      }),
      prisma.projectFollow.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    const hasNextPage = followedProjects.length > limit;
    const items = hasNextPage
      ? followedProjects.slice(0, -1)
      : followedProjects;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return NextResponse.json({
      data: items.map((follow) => follow.project),
      pagination: {
        nextCursor,
        hasNextPage,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching followed projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch followed projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession();
    const { projectId } = await request.json();

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    if (!projectId) {
      return NextResponse.json(
        {
          message: "projectId is required",
        },
        { status: 400 },
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "project not found",
        },
        { status: 404 },
      );
    }

    // Check if already following
    const existingFollow = await prisma.projectFollow.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow the project
      await prisma.projectFollow.delete({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      });

      return NextResponse.json({
        message: "project unfollowed successfully",
        followed: false,
      });
    }

    // Follow the project
    await prisma.projectFollow.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    return NextResponse.json({
      message: "project followed successfully",
      followed: true,
    });
  } catch (error) {
    console.error("Error following/unfollowing project:", error);
    return NextResponse.json(
      { error: "Failed to follow/unfollow project" },
      { status: 500 },
    );
  }
}
