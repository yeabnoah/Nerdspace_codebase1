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

    const [user, sessions, accounts, verification] = await Promise.all([
      prisma.user.findUnique({
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
              sessions: true,
              accounts: true,
            },
          },
        },
      }),
      prisma.session.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.account.findMany({
        where: {
          userId: session.user.id,
        },
      }),
      prisma.verification.findFirst({
        where: {
          identifier: session.user.email,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Format sessions with device information
    const formattedSessions = sessions.map((session: any) => ({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      device: {
        userAgent: session.userAgent || "Unknown",
        ipAddress: session.ipAddress || "Unknown",
        lastActive: session.updatedAt,
      },
      isCurrent: session.id === session.id, // Compare with current session
    }));

    // Format connected accounts
    const formattedAccounts = accounts.map((account: any) => ({
      provider: account.providerId,
      email: account.accountId,
      connectedAt: account.createdAt,
      lastUsed: account.updatedAt,
    }));

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        bio: user.bio,
        nerdAt: user.nerdAt,
        coverImage: user.coverImage,
        link: user.link,
        country: user.country,
        verification: verification
          ? {
              status: "Verified",
              verifiedAt: verification.createdAt,
            }
          : {
              status: "Not Verified",
            },
        stats: {
          followers: user._count.followers,
          following: user._count.following,
          posts: user._count.posts,
          projects: user._count.Project,
          communities: user._count.Community,
          activeSessions: user._count.sessions,
          connectedAccounts: user._count.accounts,
        },
        security: {
          sessions: formattedSessions,
          connectedAccounts: formattedAccounts,
        },
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
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
