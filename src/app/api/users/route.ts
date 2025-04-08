import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
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
