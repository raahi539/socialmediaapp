import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'


type ButtonProps = {
    className?: string
} & DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;


export default function Button({className = "", ...props}: ButtonProps) {
    return (
        <button{...props} className='rounded-md bg-stone-900 text-white px-5'></button>
    )
}