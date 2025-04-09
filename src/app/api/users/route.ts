import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const exclude = searchParams.get("exclude");
    const limit = parseInt(searchParams.get("limit") || "5");

    const users = await prisma.user.findMany({
      where: exclude
        ? {
            NOT: { id: exclude },
          }
        : undefined,
      take: limit,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
