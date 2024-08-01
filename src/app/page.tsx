"use client"
import { SessionProvider } from "next-auth/react";
import TweetForm from "./components/newtweet";
import PostsList from "./components/posts";

export default function HomePage() {
  return (
    <SessionProvider>
      <div className="flex-grow">
        <header className="sticky top-0 z-10 border-b bg-stone-800 text-white text-3xl p-3 font-bold">
          Home
        </header>
        <TweetForm />
        <PostsList />
      </div>
    </SessionProvider>
  );
}
