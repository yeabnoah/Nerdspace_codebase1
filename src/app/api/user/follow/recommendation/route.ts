import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;

    console.log("Cursor:", cursor); // Log the cursor value

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: session.user.id,
        },
        NOT: {
          following: {
            some: {
              followerId: session.user.id,
            },
          },
        },
      },
      take: 10,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        id: "asc",
      },
    });

    console.log("Users:", users); // Log the users fetched

    const nextCursor = users.length === 10 ? users[9].id : null;

    console.log("Next Cursor:", nextCursor);

    return NextResponse.json(
      {
        data: users,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
