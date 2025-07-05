import Card from "./Card"

export default function PageCard({
  children,
  className = "h-full",
}: {
  children: React.ReactNode,
  className?: string
}) {

    return (
        <Card className={`${className} bg-white border-accent border-1`}>
            <div className="w-full h-full p-4">
                {children}
            </div>
        </Card>
    )
}