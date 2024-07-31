"use client";

import { useEffect, useState } from 'react';
import ProfileImg from './profifle';

export default function PostsList() {
    const [posts, setPosts] = useState([]);
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

                const data = await response.json();
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
                <div key={post[0]} className="border-b p-4">
                    <div className='flex'><ProfileImg id={post.userId} src={post.createdBy.image}/>{post.createdBy.name}</div>
                    <h1>{post.name}</h1>
                </div>
            ))}
        </div>
    );
}
