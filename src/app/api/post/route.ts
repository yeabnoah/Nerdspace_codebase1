import getUserSession from "@/functions/get-user";
import postInterface from "@/interface/auth/post.interface";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/validation/post.validation";
import { Inclusive_Sans } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    const cursor = request.nextUrl.searchParams.get("cursor") || null;
    const limit = 5;

    const posts = await prisma.post.findMany({
      where: {
        access: "public",
      },
      include: {
        user: {
          include: {
            following: {
              where: { followerId: session.user.id },
              select: { id: true },
            },
          },
        },
        likes: true,
        bookmarks: true,
        media: true,
        project: {
          include: {
            _count: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const modifiedPosts = posts.map((post) => ({
      ...post,
      user: {
        ...post.user,
        isFollowingAuthor: post.user.following.length > 0,
      },
    }));

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return NextResponse.json(
      {
        data: modifiedPosts,
        nextCursor: nextCursor,
        message: "posts fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { content, fileUrls }: { content: string; fileUrls: string[] } =
      await req.json();
    const session = await getUserSession();

    const validateContent = postSchema.safeParse({ content });

    if (validateContent.error) {
      return NextResponse.json(
        {
          message: "Please provide the right parameters",
        },
        { status: 403 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        content: content,
        userId: session.user.id,
        media: {
          create: fileUrls.map((url) => ({ url, type: "IMAGE" })), // Adjust type as needed
        },
      },
    });

    return NextResponse.json(
      {
        data: newPost,
        id: session.user.id as string | "user",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while posting post",
        error: error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id }: { id: string } = await req.json();
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "Post not found or unauthorized",
        },
        { status: 404 },
      );
    }

    await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        message: "Post deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while deleting post",
        error: error,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const { id, content }: { id: string; content: string } = await req.json();
    const session = await getUserSession();

    const validateContent = postSchema.safeParse({ content });

    if (validateContent.error) {
      return NextResponse.json(
        {
          message: "Please provide the right parameters",
        },
        { status: 403 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized | not logged in",
        },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: id, userId: session.user.id },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        { status: 404 },
      );
    }

    console.log({
      postUserId: post?.userId,
      sessionUserId: session.user.id,
      postId: post?.id,
      sessionId: session.user.id,
    });

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "unauthorized | not the author of the post",
        },
        { status: 404 },
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: { content: content },
    });

    return NextResponse.json(
      {
        data: updatedPost,
        message: "Post updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while updating post",
        error: error,
      },
      { status: 500 },
    );
  }
};
