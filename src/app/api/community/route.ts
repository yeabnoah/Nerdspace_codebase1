import getUserSession from "@/functions/get-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  categoryId: z.string().optional(),
});

export const GET = async (request: NextRequest) => {
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
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    const communities = await prisma.community.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        creator: true,
        members: true,
        posts: true,
      },
    });

    const hasMore = communities.length > limit;
    if (hasMore) {
      communities.pop();
    }

    return NextResponse.json(
      {
        message: "Communities fetched successfully",
        data: communities,
        hasMore,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { communityId, content, image } = await request.json();
    if (!communityId || !content) {
      return NextResponse.json(
        { message: "Community ID and content are required" },
        { status: 400 },
      );
    }

    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!community) {
      return NextResponse.json(
        { message: "Community not found" },
        { status: 404 },
      );
    }

    const post = await prisma.communityPost.create({
      data: {
        content,
        image: image || null,
        communityId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", data: post },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
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

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 },
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this post" },
        { status: 403 },
      );
    }

    await prisma.communityPost.delete({ where: { id: postId } });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const { postId, content, image } = await request.json();
    if (!postId || !content) {
      return NextResponse.json(
        { message: "Post ID and content are required" },
        { status: 400 },
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to edit this post" },
        { status: 403 },
      );
    }

    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: { content, image: image || null },
    });

    return NextResponse.json(
      { message: "Post updated successfully", data: updatedPost },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// export const POST_LIKE = async (request: NextRequest) => {
//   try {
//     const session = await getUserSession();
//     if (!session) {
//       return NextResponse.json(
//         { message: "unauthorized | not logged in" },
//         { status: 400 },
//       );
//     }

//     const { postId } = await request.json();
//     if (!postId) {
//       return NextResponse.json(
//         { message: "Post ID is required" },
//         { status: 400 },
//       );
//     }

//     const post = await prisma.communityPost.findUnique({
//       where: { id: postId },
//     });
//     if (!post) {
//       return NextResponse.json({ message: "Post not found" }, { status: 404 });
//     }

//     const like = await prisma.like.create({
//       data: {
//         userId: session.user.id,
//         communityPostId: postId,
//       },
//     });

//     return NextResponse.json(
//       { message: "Post liked successfully", data: like },
//       { status: 201 },
//     );
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// };

// export const POST_COMMENT = async (request: NextRequest) => {
//   try {
//     const session = await getUserSession();
//     if (!session) {
//       return NextResponse.json(
//         { message: "unauthorized | not logged in" },
//         { status: 400 },
//       );
//     }

//     const { postId, content, parentId } = await request.json();
//     if (!postId || !content) {
//       return NextResponse.json(
//         { message: "Post ID and content are required" },
//         { status: 400 },
//       );
//     }

//     const post = await prisma.communityPost.findUnique({
//       where: { id: postId },
//     });
//     if (!post) {
//       return NextResponse.json({ message: "Post not found" }, { status: 404 });
//     }

//     const comment = await prisma.postComment.create({
//       data: {
//         content,
//         postId,
//         userId: session.user.id,
//         parentId: parentId || null,
//       },
//     });

//     return NextResponse.json(
//       { message: "Comment added successfully", data: comment },
//       { status: 201 },
//     );
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// };
