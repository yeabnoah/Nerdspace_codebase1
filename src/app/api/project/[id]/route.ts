import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        _count: true,
        user: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: project,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
