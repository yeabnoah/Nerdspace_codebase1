import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MediaSchema = z.object({
  postId: z.string(),
  url: z.string().url(),
  mediaType: z.enum(["IMAGE", "VIDEO", "GIF"]),
});

type MediaType = z.infer<typeof MediaSchema>;

export const POST = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const body: MediaType = await req.json();

    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const validationValue = MediaSchema.safeParse(body);
    if (!validationValue.success || validationValue.error) {
      return NextResponse.json(
        { message: "validation error", error: validationValue.error.message },
        { status: 401 },
      );
    }

    const newMedia = await prisma.media.create({
      data: {
        postId: body.postId,
        url: body.url,
        type: body.mediaType,
      },
    });

    return NextResponse.json(
      {
        data: newMedia,
        message: "Media uploaded successfully",
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
