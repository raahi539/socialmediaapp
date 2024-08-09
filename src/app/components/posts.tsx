"use client";
import { useState, useEffect } from 'react';
import ProfileImg from './profile';
import Button from './button';
import { useSession } from 'next-auth/react';

export default function PostsList() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function fetchPosts(page = 1) {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts(page);
    }, [page, session?.user?.id]);

    function handleNextPage() {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    function handlePreviousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            {posts.map(post => (
                <div key={post.id} className="border-b p-4 flex space-y-4 md:space-y-4 flex-col">
                    {/* Existing Post Content */}
                    <div className="flex space-x-4 md:items-center flex-col md:flex-row">
                        <ProfileImg id={post.userId} src={post.createdBy.image} />
                        <div>
                            <h1 className='font-bold text-lg'>{post.createdBy.name}</h1>
                            <h2 className='text-sm text-gray-600'>{post.name}</h2>
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
                    </div>
                    
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const content = formData.get('content') as string;
                                addComment(post.id, content);
                                e.currentTarget.reset();
                            }}
                            className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4"
                        >
                            <textarea
                                name="content"
                                className="flex-grow resize-none overflow-hidden p-2 text-base border rounded-md"
                                placeholder="What's happening?"
                            />
                            <Button type="submit" className="w-full md:w-auto mt-2 md:mt-0">Comment</Button>
                        </form>
                    </div>
                    <div>
                    <CommentDrawer comments={post.comments} /></div>
                </div>
            ))}
            <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </Button>
                <Button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </Button>
            </div>
        </div>
    );
}
