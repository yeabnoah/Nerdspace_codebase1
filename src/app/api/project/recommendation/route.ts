import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 3;

  try {
    const projects = await prisma.project.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    const totalProjects = await prisma.project.count();
    const totalPages = Math.ceil(totalProjects / pageSize);

    return NextResponse.json({
      projects,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalProjects,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
