// app/api/explore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const searchConditions = {
      take: ITEMS_PER_PAGE,
      skip,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    };

    const results: any = {};

    if (type === "all" || type === "user") {
      const users = await prisma.user.findMany({
        ...searchConditions,
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { nerdAt: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          nerdAt: true,
          image: true,
          bio: true,
        },
      });
      results.users = users;
    }

    if (type === "all" || type === "post") {
      const posts = await prisma.post.findMany({
        ...searchConditions,
        where: {
          content: { contains: query, mode: "insensitive" },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              nerdAt: true,
              image: true,
            },
          },
          likes: true,
          bookmarks: true,
          media: true,
        },
      });
      results.posts = posts;
    }

    if (type === "all" || type === "project") {
      const projects = await prisma.project.findMany({
        ...searchConditions,
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { category: { has: query } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              nerdAt: true,
              image: true,
            },
          },
          stars: true,
          ratings: true,
        },
      });
      results.projects = projects;
    }

    if (type === "all" || type === "community") {
      const communities = await prisma.community.findMany({
        ...searchConditions,
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              nerdAt: true,
              image: true,
            },
          },
          members: {
            select: {
              id: true,
            },
          },
        },
      });
      results.communities = communities;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
