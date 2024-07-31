// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { userId, name } = await req.json();

    if (!userId || !name) {
        return NextResponse.json({ error: 'Missing userId or name' }, { status: 400 });
    }

    try {
        const post = await prisma.post.create({
            data: {
                userId: userId,
                name: name,
            },
        });
        console.log('Post created:', post); // Log the post object
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                createdBy: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
