import Image from "next/image"
import Link from "next/link"

type ProfileImageProps = {
    id: string
    src ?: string | null
    classname ?: String
}


export default function ProfileImg({ id, src, classname=""}: ProfileImageProps) {
    return(
        <>
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Link href={"/profile/"+id}>{src == null ? null : <Image src={src} alt="profile image" fill/>}</Link>
        </div>
        </>
    )
}