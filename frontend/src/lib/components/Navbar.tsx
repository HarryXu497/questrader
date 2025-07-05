import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between px-10 py-6 gap-4 border-b-2 w-full text-xl items-center border-[#EFEFEF]">
      <div>
        <Image
        width={200}
        height={48}
        src="/images/logo.svg"
        alt="Questrader"
        />
      </div>

      <div className="text-accent font-bold">
        <ul className="flex flex-row gap-8">
          <li>
            <a href="/level/1">Market</a>
          </li>
          <li>
            <a href="/portfolio">Portfolio</a>
          </li>
          <li>
            <a href="">Learn</a>
          </li>
        </ul>
      </div>

    <div className="text-accent font-bold">
        <ul className="flex flex-row gap-4">
          <li>
            Welcome, Harry!
          </li>
        </ul>
      </div>
    </nav>
  );
}
