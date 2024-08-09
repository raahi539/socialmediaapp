// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    try {
        const posts = await prisma.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                createdBy: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        const totalPosts = await prisma.post.count();

        return NextResponse.json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
