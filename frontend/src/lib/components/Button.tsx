import React from "react"

export default function Button({
    onClick,
    children,
}: {
    onClick: () => void,
    children: React.ReactNode,
}) {
    return (
        <button onClick={onClick} className="py-4 px-8 bg-primary-400 text-2xl rounded-[20px] shadow-">
            {children}
        </button>
    )
}