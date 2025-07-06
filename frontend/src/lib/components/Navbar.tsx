"use client";

import { RiAccountCircle2Line } from "@remixicon/react";
import Image from "next/image";
import useAuthStore from "../state/authState";

export default function Navbar() {
  const authStore = useAuthStore();
  const authenticated = authStore.user != null;

  return (
    <nav className="flex flex-row justify-between px-10 py-6 gap-4 border-b-2 w-full text-xl items-center border-[#84D0ED]">
      <div className="flex flex-row gap-6 items-center">
        <a href="/">
          <Image
            width={200}
            height={48}
            src="/images/logo.svg"
            alt="Questrader"
          />
        </a>

      {authenticated && (
        <div className="text-accent font-bold">
          <ul className="flex flex-row gap-8">
            <li>
              <a href="/market">Market</a>
            </li>
            <li>
              <a href="/portfolio">Portfolio</a>
            </li>
            <li>
              <a href="/level/1">Learn</a>
            </li>
          </ul>
        </div>
      )}
    </div>

      {authenticated && (
        <div className="text-gray-500 font-bold">
          <ul className="flex flex-row items-center gap-4">
            <li>Welcome, {authStore.user?.displayName}!</li>
            <li>
              <RiAccountCircle2Line size={36} className="text-gray-500" />
            </li>
          </ul>
        </div>
      )}

      {!authenticated && (
        <>
          <div className="text-accent font-bold">
            <ul className="flex flex-row gap-5">
              <li>
                <a
                  href="/log-in"
                  className="px-7 py-3 border-1 border-accent text-accent rounded-[20px] text-lg font-bold"
                >
                  Log In
                </a>
              </li>
              <li>
                <a
                  href="/sign-up"
                  className="px-7 py-3 border-1 border-accent bg-accent text-white rounded-[20px] text-lg font-bold"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
