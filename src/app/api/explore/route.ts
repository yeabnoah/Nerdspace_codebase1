// app/api/explore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserSession from "@/functions/get-user";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

interface Filter {
  field: string;
  value: any;
}

interface Filters {
  user?: Filter[];
  post?: Filter[];
  project?: Filter[];
  community?: Filter[];
}

type OrderByInput = {
  createdAt?: Prisma.SortOrder;
  _count?: {
    followers?: Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    stars?: Prisma.SortOrder;
    members?: Prisma.SortOrder;
  };
};

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
    const sortBy = searchParams.get("sort") || "relevance";
    const filters: Filters = searchParams.get("filters")
      ? JSON.parse(searchParams.get("filters")!)
      : {};

    // Split query into words for better partial matching
    const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);

    const getOrderBy = (entityType: string): OrderByInput => {
      switch (sortBy) {
        case "newest":
          return { createdAt: Prisma.SortOrder.desc };
        case "popular":
          switch (entityType) {
            case "user":
              return { _count: { followers: Prisma.SortOrder.desc } };
            case "post":
              return { _count: { likes: Prisma.SortOrder.desc } };
            case "project":
              return { _count: { stars: Prisma.SortOrder.desc } };
            case "community":
              return { _count: { members: Prisma.SortOrder.desc } };
            default:
              return { createdAt: Prisma.SortOrder.desc };
          }
        default:
          // For relevance, we'll use a combination of text match and engagement
          return { createdAt: Prisma.SortOrder.desc };
      }
    };

    const createSearchConditions = (entityType: string) => ({
      take: ITEMS_PER_PAGE,
      skip,
      orderBy: getOrderBy(entityType),
    });

    const results: any = {};

    // Helper function to create OR conditions for text search
    const createTextSearchConditions = (fields: string[]) => {
      return {
        OR: fields.map((field) => ({
          [field]: {
            contains: query,
            mode: "insensitive",
          },
        })),
      };
    };

    if (type === "all" || type === "user") {
      const users = await prisma.user.findMany({
        ...createSearchConditions("user"),
        where: {
          AND: [
            {
              OR: [
                ...queryWords.map((word) => ({
                  name: { contains: word, mode: "insensitive" },
                })),
                ...queryWords.map((word) => ({
                  nerdAt: { contains: word, mode: "insensitive" },
                })),
                ...queryWords.map((word) => ({
                  bio: { contains: word, mode: "insensitive" },
                })),
              ],
            },
            ...(filters.user || []).map((filter: Filter) => ({
              [filter.field]: filter.value,
            })),
          ],
        },
        select: {
          id: true,
          name: true,
          nerdAt: true,
          image: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
      });
      results.users = users;
    }

    if (type === "all" || type === "post") {
      const posts = await prisma.post.findMany({
        ...createSearchConditions("post"),
        where: {
          AND: [
            {
              OR: [
                ...queryWords.map((word) => ({
                  content: { contains: word, mode: "insensitive" },
                })),
              ],
            },
            ...(filters.post || []).map((filter: Filter) => ({
              [filter.field]: filter.value,
            })),
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
          likes: true,
          bookmarks: true,
          media: true,
          _count: {
            select: {
              likes: true,
              bookmarks: true,
            },
          },
        },
      });
      results.posts = posts;
    }

    if (type === "all" || type === "project") {
      const projects = await prisma.project.findMany({
        ...createSearchConditions("project"),
        where: {
          AND: [
            {
              OR: [
                ...queryWords.map((word) => ({
                  name: { contains: word, mode: "insensitive" },
                })),
                ...queryWords.map((word) => ({
                  description: { contains: word, mode: "insensitive" },
                })),
                ...queryWords.map((word) => ({
                  category: { has: word },
                })),
              ],
            },
            ...(filters.project || []).map((filter: Filter) => ({
              [filter.field]: filter.value,
            })),
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
          _count: {
            select: {
              stars: true,
              ratings: true,
            },
          },
        },
      });
      results.projects = projects;
    }

    if (type === "all" || type === "community") {
      const communities = await prisma.community.findMany({
        ...createSearchConditions("community"),
        where: {
          AND: [
            {
              OR: [
                ...queryWords.map((word) => ({
                  name: { contains: word, mode: "insensitive" },
                })),
                ...queryWords.map((word) => ({
                  description: { contains: word, mode: "insensitive" },
                })),
              ],
            },
            ...(filters.community || []).map((filter: Filter) => ({
              [filter.field]: filter.value,
            })),
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
          _count: {
            select: {
              members: true,
              posts: true,
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
