"use client";
import ProfileImg from './profifle';
import Button from './button';
import { useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    image: string;
};

type Post = {
    id: string;
    userId: string;
    name: string;
    createdBy: User;
};

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/posts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data: Post[] = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {posts.map(post => (
                <div key={post.id} className="border-b p-4">
                    <div className="flex items-center">
                        <ProfileImg id={post.userId} src={post.createdBy.image} />
                        <h1 className='font-bold px-2'>{post.createdBy.name}</h1>
                    </div>
                    <h1 className='p-2'>{post.name}</h1>
                    <hr></hr>
                    <div className='flex flex-row'>
                        <div className='flex items-center'>
                            <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h1>0</h1>
                            <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h1>1</h1>
                        </div>
                        <form className='flex flex-grow p-2 h-16'>
                            <textarea
                                className="flex-grow resize-none overflow-hidden p-4 text-lg"
                                placeholder="What's happening?"
                            />
                            <Button>Comment</Button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}
