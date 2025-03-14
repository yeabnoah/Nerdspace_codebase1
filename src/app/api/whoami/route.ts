import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      include: {
        posts: true,
        country: true,
      },
    });

    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
