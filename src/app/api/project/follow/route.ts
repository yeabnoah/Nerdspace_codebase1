import getUserSession from "@/functions/get-user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
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
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
