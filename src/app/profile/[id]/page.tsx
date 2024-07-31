"use client"
import { useSession } from "next-auth/react"
import ProfileImg from "~/app/components/profifle"



export default function Page({ params }: { params: { id: string } }) {
    const session = useSession()
    
    return (
        <>
            <div>
                <ProfileImg id={params.id} src={session.data?.user.image}/>
                <h1>Name: {session.data?.user.name}</h1>
                <h1>E-Mail: {session.data?.user.email}</h1>
            </div>
        </>
    )
  }