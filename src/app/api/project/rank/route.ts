import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10); // Default limit set to 5
    const cursor = req.nextUrl.searchParams.get("cursor");

    const projects = await prisma.project.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        stars: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: { stars: true },
        },
      },
    });

    const nextCursor =
      projects.length === limit ? projects[projects.length - 1].id : null;

    return NextResponse.json({
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        stars: project._count.stars,
      })),
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching project rankings:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
