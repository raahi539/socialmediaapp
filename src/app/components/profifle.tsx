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
        <div className="relative h-12 w-12 overflow-hidden rounded-full my-2">
            <Link href={"/profile/"+id}>{src == null ? <Image src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="profile image" fill/> : <Image src={src} alt="profile image" fill/>}</Link>
        </div>
        </>
    )
}