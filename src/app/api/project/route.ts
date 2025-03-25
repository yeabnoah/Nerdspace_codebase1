import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
});

type ProjectInterface = z.infer<typeof projectSchema>;

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return Response.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const body: ProjectInterface = await request.json();
    const validation = projectSchema.safeParse(body);

    if (validation.error || !validation.success) {
      return NextResponse.json(
        {
          message: validation.error.message,
        },
        { status: 400 },
      );
    }

    const newProject = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        userId: session.user.id,
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
