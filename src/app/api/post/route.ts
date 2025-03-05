import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        const posts = await prisma.post.findMany();
        return NextResponse.json({
            data: posts,
            message: "posts fetched successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "error" }, 
            { status: 500 });
    }
}

export async function POST (req : Request) {
    try {
        // const {session} = authClient.getSession();
        const {content} = await req.json();
        const post = await prisma.post.create({
            data: {
                content : content,
                userId: "1"
            }
        });
        return NextResponse.json({
            data: post,
            message: "post created successfully"
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "error" }, 
            { status: 500 });
    }
}
