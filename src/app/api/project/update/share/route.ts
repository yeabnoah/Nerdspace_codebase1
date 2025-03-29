import getUserSession from "@/functions/get-user";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { postSchema, PostType } from "@/validation/post.validation";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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

    const body: PostType = await req.json();

    const validation = postSchema.safeParse(body);

    if (!validation.success || validation.error) {
      return NextResponse.json(
        {
          message: "error happened while validating the req body",
          error: validation.error.message,
        },
        { status: 402 },
      );
    }

    // Validate if the projectId exists
    const projectExists = await prisma.project.findUnique({
      where: { id: body.projectId },
    });

    if (!projectExists) {
      return NextResponse.json(
        {
          message: "Invalid projectId. Project does not exist.",
        },
        { status: 404 },
      );
    }

    const newShare = await prisma.post.create({
      data: {
        content: body.content,
        userId: session.user.id,
        media: {
          create:
            body.fileUrls &&
            body?.fileUrls.map((url) => ({ url, type: "IMAGE" })),
        },
        shared: true,
        projectId: body.projectId,
      },
    });

    return NextResponse.json(
      {
        message: "successfully shared project-Update",
        data: newShare,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
