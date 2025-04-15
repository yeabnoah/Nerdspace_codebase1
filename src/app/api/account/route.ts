import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        country: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            Project: true,
            Community: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        nerdAt: user.nerdAt,
        coverImage: user.coverImage,
        link: user.link,
        country: user.country,
        stats: {
          followers: user._count.followers,
          following: user._count.following,
          posts: user._count.posts,
          projects: user._count.Project,
          communities: user._count.Community,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching account settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
