import { DetailedHTMLProps, HTMLAttributes } from "react"

export default function Card({
  children,
  className = "",
  ...otherProps
}: DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
  children: React.ReactNode,
  className?: string,
}) {
    return (
        <div className={`rounded-[20px] overflow-hidden ${className}`} {...otherProps}>
            {children}
        </div>
    )
}