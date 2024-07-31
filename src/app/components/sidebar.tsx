
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Sidebar() {

    const session = useSession()
    const user = session.data?.user
    console.log(user)

    return (
        <nav className="sticky top-0 self-start px-3 py-4 text-white bg-stone-900 min-h-screen">
            Social Media App
            <hr />
            <ul className="flex flex-col">
                <li className="py-2">
                    <Link href={"/"}>
                        Home
                    </Link>
                </li>
                {user != null && (
                <li className="py-2">
                    <Link href={`/profile/${user.id}`}>
                        Profile
                    </Link>
                </li>)}
                {user != null ? (<li className="py-2">
                    <button onClick={() => void signOut()}>Sign Out</button>
                </li>) : (<li className="py-2">
                    <button onClick={() => void signIn()}>Sign In</button>
                </li>)}

            </ul>
        </nav>
    )
}