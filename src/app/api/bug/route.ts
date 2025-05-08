import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { bugReportSchema } from "@/validation/bug.validation";
import { NextRequest, NextResponse } from "next/server";

export enum bugReportSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum bugReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export async function GET(request: NextRequest) {
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

    const bugReports = await prisma.bugReport.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: bugReports,
        message: "bug reports fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while fetching bug reports",
        error: error,
      },
      { status: 500 },
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const {
      content,
      bugseverity,
      status,
    }: { content: string; bugseverity: string; status: string } =
      await req.json();

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const validateBugReport = bugReportSchema.safeParse({
      content,
      bugseverity,
      status,
    });

    if (!validateBugReport.success) {
      return NextResponse.json(
        {
          message: "Invalid bug report data",
          errors: validateBugReport.error.errors,
        },
        { status: 400 },
      );
    }

    const newBugReport = await prisma.bugReport.create({
      data: {
        userId: session.user.id,
        content: content,
        bugseverity: (bugseverity as bugReportSeverity) || "LOW",
        status: (status as bugReportStatus) || "PENDING",
      },
    });

    return NextResponse.json(
      {
        data: newBugReport,
        id: session.user.id as string | "user",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while posting post",
        error: error,
      },
      { status: 500 },
    );
  }
};
