import { useMemo } from "react";
import Card from "./Card";
import dateFormatter from "../utils/dateFormatter";


export default function FeedCard({
  article,
  date,
  cardClassName,
  truncateText = true,
}: {
  article: Article;
  date: Date;
  cardClassName?: string,
  truncateText?: boolean
}) {
  const { title, content, location } = article;
  const isStringTooLong = content.length > 40;
  const formattedDate = useMemo(() => dateFormatter.format(date), [date]);
  const truncatedText = isStringTooLong ? content.substring(0, 40) + "..." : content

  return (
    <Card className={cardClassName}>
      <div className="bg-gray-50 border-accent border-1 w-full p-4 flex flex-col gap-1 rounded-[20px] h-full items-start overflow-scroll no-scrollbar">
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-gray-900 text-xl/tight text-start">{title}</h3>
          <h4 className="text-sm text-gray-400 text-start">
            {formattedDate} &middot; {location}
          </h4>
        </div>

        <p className="text-sm text-start whitespace-pre-wrap">
            {truncateText ? truncatedText : content}
        </p>
      </div>
    </Card>
  );
}
