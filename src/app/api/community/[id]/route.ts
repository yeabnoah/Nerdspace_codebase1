import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        category: true,
        members: true,
        posts: {
          include: {
            user: true, // Include user relation for posts
          },
        },
        creator: true,
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(community, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
