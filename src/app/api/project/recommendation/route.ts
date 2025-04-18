import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 401 },
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: {
          not: session.user.id,
        },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        followers: true,
      },
    });

    const transformedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      image: project.image || "/placeholder-image.jpg",
      status: project.status,
      category: project.category || [],
      members: project.followers.length,
    }));

    return NextResponse.json({ projects: transformedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
