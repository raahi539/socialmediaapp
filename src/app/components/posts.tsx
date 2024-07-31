"use client";
import ProfileImg from './profifle';
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
          <div className="flex">
            <ProfileImg id={post.userId} src={post.createdBy.image} />
            {post.createdBy.name}
          </div>
          <h1>{post.name}</h1>
        </div>
      ))}
    </div>
  );
}
