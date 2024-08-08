import { NextRequest, NextResponse } from 'next/server';
import prisma from 'prisma/client';

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    const { userId, content } = await req.json();

    try {
        await prisma.comment.create({
            data: {
                userId,
                postId,
                content,
            },
        });
        return NextResponse.json({ message: 'Comment added' });
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.error();
    }
}

export async function GET(request: Request, { params }: { params: { postId: string } }) {
    const { postId } = params;

    if (!postId) {
        return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: { user: true }, // Include user data in the comments
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}
