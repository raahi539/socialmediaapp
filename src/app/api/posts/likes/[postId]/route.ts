// src/app/api/posts/likes/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    const { userId } = await req.json();

    try {
        // Check if the like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: String(userId),
                    postId: String(postId),
                },
            },
        });

        if (existingLike) {
            return NextResponse.json({ error: 'Post already liked' }, { status: 400 });
        }

        await prisma.like.create({
            data: {
                postId: String(postId),
                userId: String(userId),
            },
        });

        return NextResponse.json({ message: 'Post liked' });
    } catch (error) {
        console.error('Error creating like:', error);
        return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    const { userId } = await req.json();

    try {
        // Check if the like exists before attempting to delete
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: String(userId),
                    postId: String(postId),
                },
            },
        });

        if (!existingLike) {
            return NextResponse.json({ error: 'Like not found' }, { status: 404 });
        }

        await prisma.like.delete({
            where: {
                userId_postId: {
                    postId: String(postId),
                    userId: String(userId),
                },
            },
        });

        return NextResponse.json({ message: 'Post unliked' });
    } catch (error) {
        console.error('Error deleting like:', error);
        return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 });
    }
}


export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const likes = await prisma.like.findMany({
      where: {
        postId: params.postId
      },
      select: { // Only select the necessary data
        userId: true
      }
    });
    return NextResponse.json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.error();
  }
}


