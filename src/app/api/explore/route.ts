// app/api/explore/route.ts
import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma"; // Update this if your prisma path is different
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const type = searchParams.get("type") || "all";

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
    const queries: Record<string, Promise<any[]>> = {
      user: prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nerdAt: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, nerdAt: true, image: true },
        take: 10,
      }),
      post: prisma.post.findMany({
        where: {
          content: { contains: q, mode: "insensitive" },
        },
        select: { id: true, content: true, createdAt: true, userId: true },
        take: 10,
      }),
      project: prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { has: q } },
          ],
        },
        select: { id: true, name: true, description: true, image: true },
        take: 10,
      }),
      community: prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, image: true, description: true },
        take: 10,
      }),
    };

    const results: Record<string, any> = {};

    if (type === "all") {
      const [users, posts, projects, communities] = await Promise.all([
        queries.user,
        queries.post,
        queries.project,
        queries.community,
      ]);
      results.users = users;
      results.posts = posts;
      results.projects = projects;
      results.communities = communities;
    } else if (type in queries) {
      results[type + "s"] = await queries[type];
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
