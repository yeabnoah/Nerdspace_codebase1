import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized | Not logged in" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter((part) => part !== "");
    const id = pathParts[pathParts.length - 1]; // Assuming the last part is the id

    const cursor = req.nextUrl.searchParams.get("cursor");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "3", 10); // Default to 3 updates per page

    const updates = await prisma.projectUpdate.findMany({
      where: { projectId: id },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { likes: true, comments: true },
    });

    const nextCursor =
      updates.length === limit ? updates[updates.length - 1].id : null;

    return NextResponse.json(
      {
        data: updates,
        nextCursor, // Include nextCursor in the response
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching project updates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
