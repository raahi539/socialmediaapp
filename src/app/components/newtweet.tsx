"use client";

import { useSession } from 'next-auth/react';
import Button from './button';
import ProfileImg from './profile';
import { useState } from 'react';

export default function TweetForm() {
    const { data: session, status } = useSession();
    const [postContent, setPostContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (status !== 'authenticated') return null;

    async function Post(postContent: string) {
        if (!session?.user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    name: postContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const post = await response.json();
            console.log('Post created:', post);

            // Handle post creation success (e.g., clear textarea, show success message, etc.)
            setPostContent(''); // Clear the textarea after posting
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        Post(postContent);
    }

    return (
        <form className="flex flex-col gap-2 border-b px-4 py-2" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <ProfileImg id={session.user.id} src={session.user.image} />
                <textarea
                    className="flex-grow resize-none overflow-hidden p-4 text-lg"
                    placeholder="What's happening?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}
