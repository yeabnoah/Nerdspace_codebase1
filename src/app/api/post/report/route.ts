import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reportSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  reason: z.string(),
});

export type reportType = z.infer<typeof reportSchema>;

export const POST = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 401 },
      );
    }

    const body: reportType = await req.json();
    const checkValidation = reportSchema.safeParse(body);

    if (!checkValidation.success) {
      return NextResponse.json(
        { error: checkValidation.error.message },
        { status: 400 },
      );
    }

    const reportExist = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        ...(body.postId
          ? { postId: body.postId }
          : { commentId: body.commentId }),
      },
    });

    if (reportExist) {
      return NextResponse.json(
        { message: "Report already exists" },
        { status: 409 },
      );
    }

    const requestBody = {
      reporterId: session.user.id,
      ...body,
    };

    const newReport = await prisma.report.create({
      data: requestBody,
    });

    return NextResponse.json({ data: newReport }, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
