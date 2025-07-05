import Navbar from "@/lib/components/Navbar";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-full bg-linear-to-b from-[#FFFFFF] via-[#E0FFFE] via-76% to-[#AEFFFE]">
        {children}
      </main>
    </>
  );
}
