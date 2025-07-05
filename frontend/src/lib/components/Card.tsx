export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode,
  className?: string
}) {
    return (
        <div className={`rounded-[20px] overflow-hidden ${className}`}>
            {children}
        </div>
    )
}