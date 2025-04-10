import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import getUserSession from "@/functions/get-user";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from the database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
        nerdAt: true,
        bio: true,
        countryId: true,
        image: true,
        firstTime: true,
        coverImage: true,
        link: true,
        country: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user has completed onboarding
    const isFirstTime = user.firstTime;

    // List of fields to check for completion
    const fieldsToCheck = [
      { name: "name", value: user.name },
      { name: "profileImage", value: user.image },
      { name: "coverImage", value: user.coverImage },
      { name: "bio", value: user.bio },
      { name: "nerdAt", value: user.nerdAt },
      { name: "country", value: user.countryId || user.country?.name },
      { name: "link", value: user.link },
    ];

    // Count how many fields are filled
    const filledFields = fieldsToCheck.filter(
      (field) => field.value && field.value !== "",
    ).length;

    // Calculate percentage (each field is worth 1 point, total 7 fields)
    const completionPercentage = Math.round((filledFields / 7) * 100);

    return NextResponse.json({
      isFirstTime,
      userData: user,
      completionPercentage,
      filledFields,
      totalFields: 7,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
