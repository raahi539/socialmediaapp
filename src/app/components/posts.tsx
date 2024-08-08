"use client"
import { useState } from 'react';
import ProfileImg from './profile';
import Button from './button';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

type User = {
    id: string;
    name: string;
    image: string;
};

type Comment = {
    id: string;
    content: string;
    createdAt: string;
    user: User;
};

type Post = {
    id: string;
    userId: string;
    name: string;
    createdBy: User;
    likes: number;
    views: number;
    isLiked: boolean;
    comments: Comment[];
};

export default function PostsList() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
            }
            const data: Post[] = await response.json();

            const postsWithDetails = await Promise.all(
                data.map(async post => {
                    const likesResponse = await fetch(`/api/posts/likes/${post.id}`);
                    const commentsResponse = await fetch(`/api/posts/comments/${post.id}`);

                    if (!likesResponse.ok || !commentsResponse.ok) {
                        throw new Error(`Failed to fetch likes or comments for post ${post.id}`);
                    }

                    const likesData: { userId: string }[] = await likesResponse.json();
                    const commentsData: Comment[] = await commentsResponse.json();

                    return {
                        ...post,
                        likes: likesData.length,
                        isLiked: likesData.some(like => like.userId === session?.user?.id),
                        comments: commentsData, // Add comments to the post
                    };
                })
            );
            setPosts(postsWithDetails);

        } catch (error) {
            console.error('Error fetching posts or likes/comments:', error);
            // Handle error gracefully in your UI
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchPosts();
    }, [session?.user?.id]);

    async function toggleLike(postId: string) {
        const isCurrentlyLiked = posts.find(post => post.id === postId)?.isLiked || false;
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, isLiked: !isCurrentlyLiked, likes: post.likes + (isCurrentlyLiked ? -1 : 1) } : post
        ));
        try {
            const method = isCurrentlyLiked ? 'DELETE' : 'POST';
            const response = await fetch(`/api/posts/likes/${postId}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id })
            });
            if (!response.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Error updating like:', error);
            fetchPosts();
        }
    }

    async function addComment(postId: string, content: string) {
        if (!content.trim()) return;
        try {
            const response = await fetch(`/api/posts/comments/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id, content })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-4">
            {posts.map(post => (
                <div key={post.id} className="border-b p-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                    <div className="flex items-center space-x-4">
                        <ProfileImg id={post.userId} src={post.createdBy.image} className="w-12 h-12" />
                        <div>
                            <h1 className='font-bold text-lg'>{post.createdBy.name}</h1>
                            <h2 className='text-sm text-gray-600'>{post.name}</h2>
                        </div>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <div className='flex items-center space-x-2'>
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill={post.isLiked ? 'red' : 'none'}
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => toggleLike(post.id)}
                                className="cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <h1 className="text-sm">{post.likes}</h1>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const content = formData.get('content') as string;
                                addComment(post.id, content);
                                e.currentTarget.reset();
                            }}
                            className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"
                        >
                            <textarea
                                name="content"
                                className="flex-grow resize-none overflow-hidden p-2 text-base"
                                placeholder="What's happening?"
                            />
                            <Button type="submit" className="w-full md:w-auto">Comment</Button>
                        </form>
                    </div>

                    {/* Comment Drawer */}
                    <CommentDrawer comments={post.comments} />
                </div>
            ))}
        </div>
    );
}


function CommentDrawer({ comments = [] }: { comments?: Comment[] }) {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => setShowAll(!showAll);

    if (comments.length === 0) {
        return <p className="text-gray-500">No comments yet.</p>;
    }

    return (
        <div className="p-4 space-y-4">
            {comments.length > 0 && (
                <>
                    <div className="border-t pt-2">
                        <div className="flex items-center space-x-2">
                            <ProfileImg id={comments[0]?.user?.id || ''} src={comments[0]?.user?.image || ''} className="w-10 h-10" />
                            <div>
                                <p className="font-bold text-sm">{comments[0]?.user?.name || 'Unknown'}</p>
                                <p className="text-sm">{comments[0]?.content || ''}</p>
                            </div>
                        </div>
                    </div>
                    {showAll && comments.slice(1).map(comment => (
                        <div key={comment.id} className="border-t pt-2">
                            <div className="flex items-center space-x-2">
                                <ProfileImg id={comment.user?.id || ''} src={comment.user?.image || ''} className="w-10 h-10" />
                                <div>
                                    <p className="font-bold text-sm">{comment.user?.name || 'Unknown'}</p>
                                    <p className="text-sm">{comment.content || ''}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {comments.length > 1 && (
                        <button
                            onClick={toggleShowAll}
                            className="text-blue-500 underline mt-2 text-sm"
                        >
                            {showAll ? 'Show Less' : `Show All ${comments.length} Comments`}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}


