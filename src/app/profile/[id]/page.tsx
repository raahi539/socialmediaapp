"use client"
import { useSession } from "next-auth/react"
import PostsList from "~/app/components/posts"
import ProfileImg from "~/app/components/profile"



export default function Page({ params }: { params: { id: string } }) {
    const session = useSession()

    return (
        <>
            <div className="flex-grow">
                <header className="sticky top-0 z-10 border-b bg-stone-800 text-white text-3xl p-3 font-bold">Profile</header>
                <div className="flex items-center p-5">
                    <ProfileImg id={params.id} src={session.data?.user.image} />
                    <div className="px-3"><h1 className="text-3xl font-bold">{session.data?.user.name}</h1>
                        <h1>E-Mail: {session.data?.user.email}</h1>
                    </div>
                </div>
                <div className="">
                    <h1 className="px-4 text-3xl font-bold">Posts:</h1>
                    <PostsList />
                    <hr />
                    <div className="px-4">
                    <h1 className="py-4 text-3xl font-bold">Following:</h1>
                    <div className="flex items-center">
                        <ProfileImg id={""} />
                        <h1 className='font-bold px-2'>Test User</h1>
                    </div></div>
                </div>

            </div>
        </>
    )
}