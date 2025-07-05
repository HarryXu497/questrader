import React from "react"

export default function Button({
    onClick,
    children,
}: {
    onClick: () => void,
    children: React.ReactNode,
}) {
    return (
        <button onClick={onClick} className="py-4 px-1 grow bg-accent border-accent text-white border-1 text-2xl rounded-[20px] shadow-">
            {children}
        </button>
    )
}