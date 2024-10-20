"use client";

import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
      <div className="flex place-items-center text-xl">
        <Logo />
        <Link className={pathname == "/dashboard" ? "underline ml-2" : "ml-2"} href="/dashboard">Dashboard</Link>
      </div>
      <div className="flex gap-4 items-center">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
