import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { reportSchema, reportType } from "@/validation/report.validation";
import { NextRequest, NextResponse } from "next/server";

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

    // Check if the postId or commentId exists
    if (body.postId) {
      const postExists = await prisma.post.findUnique({
        where: { id: body.postId },
      });
      if (!postExists) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      }
    } else if (body.commentId) {
      const commentExists = await prisma.postComment.findUnique({
        where: { id: body.commentId },
      });
      if (!commentExists) {
        return NextResponse.json(
          { message: "Comment not found" },
          { status: 404 },
        );
      }
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
