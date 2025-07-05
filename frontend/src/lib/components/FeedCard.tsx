import { useMemo } from "react";
import Card from "./Card";
import dateFormatter from "../utils/dateFormatter";


export default function FeedCard({
  article,
  date,
}: {
  article: Article;
  date: Date;
}) {
  const { title, content, location } = article;
  const isStringTooLong = content.length > 40;
  const formattedDate = useMemo(() => dateFormatter.format(date), [date]);

  return (
    <Card>
      <div className="bg-gray-50 border-accent border-1 w-full p-4 flex flex-col gap-1 rounded-[20px]">
        <div>
          <h3 className="font-bold text-gray-900 text-xl/tight">{title}</h3>
          <h4 className="text-sm text-gray-400">
            {formattedDate} &middot; {location}
          </h4>
        </div>

        <p className="text-sm">
          {isStringTooLong ? content.substring(0, 40) + "..." : content}
        </p>
      </div>
    </Card>
  );
}
