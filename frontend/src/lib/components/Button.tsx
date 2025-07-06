import React from "react"

export default function Button({
    onClick,
    children,
    ...otherProps
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    onClick: () => void,
    children: React.ReactNode,
}) {
    return (
        <button onClick={onClick} {...otherProps} className="py-3 px-1 grow bg-accent border-accent disabled:bg-gray-300 text-white border-1 text-2xl rounded-[20px]">
            {children}
        </button>
    )
}