import getUserSession from "@/functions/get-user";
import {
  OnboardingSchema,
  OnboardingType,
} from "@/interface/auth/onboarding.interface";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getUserSession();
    const body: OnboardingType = await req.json();

    if (!session) {
      return NextResponse.json(
        { message: "unauthorized | not logged in" },
        { status: 400 },
      );
    }

    const validationValue = OnboardingSchema.safeParse(body);
    if (!validationValue.success) {
      return NextResponse.json(
        { message: "validation error", error: validationValue.error.message },
        { status: 401 },
      );
    }

    const { country } = body;

    const [createCountry, updatedUser] = await prisma.$transaction([
      prisma.country.create({
        data: {
          userId: session.user.id,
          ...country,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          image: body.image,
          visualName: body.displayName,
          bio: body.bio,
          firstTime: body.firstTime,
          link: body.link,
          nerdAt: body.nerdAt,
        },
        include: { country: true },
      }),
    ]);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { message: "error while updating data", error: error?.message as string },
      { status: 500 },
    );
  }
};
