import { generateUsers } from "@/script/dummy-users";
import { NextRequest, NextResponse } from "next/server";

const users = generateUsers(100);

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = users.slice(start, end);

    return NextResponse.json(
      {
        data: data,
        totalPage: Math.ceil(users.length / pageSize),
        previouspage: page - 1,
        nextpage: page + 1,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
