"use client";

import Card from "@/lib/components/Card";
import HiloOpenClose from "@/lib/components/HiloGraph/HiloGraph";
import PageCard from "@/lib/components/PageCard";


export default function Page() {
  const startDate = new Date(2025, 0, 1);

  return (
    <div className="h-[calc(100vh_-_5.375rem)] py-12">
      <section className="max-w-[72rem] min-w-[16rem] w-[80%] mx-auto h-full flex flex-row gap-5">
        <div className="h-full w-[68%]">
          <PageCard>
            <HiloOpenClose />
          </PageCard>
        </div>
        <div className="h-full flex flex-col gap-5 w-[32%]">
          <Card className="overflow-visible">
            <div className="bg-white border-accent border-1 px-4 py-3 rounded-[20px] gap-4 flex flex-col justify-between"></div>
          </Card>
          <PageCard>
            <div className="flex flex-col justify-start gap-4 grow-1 h-full overflow-scroll"></div>
          </PageCard>
        </div>
      </section>
    </div>
  );
}
