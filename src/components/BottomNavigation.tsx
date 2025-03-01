"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PlusIcon, CalendarIcon, LeafIcon } from "./Icons";

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 safe-bottom">
      <div className="flex items-center justify-around h-16">
        <Link href="/" className="flex-1 h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <HomeIcon
              className={`w-5 h-5 ${
                isActive("/") ? "text-primary" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/") ? "text-primary" : "text-gray-500"
              }`}
            >
              Dzisiaj
            </span>
          </div>
        </Link>

        <Link href="/plants" className="flex-1 h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <LeafIcon
              className={`w-5 h-5 ${
                isActive("/plants") ? "text-primary" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/plants") ? "text-primary" : "text-gray-500"
              }`}
            >
              Rośliny
            </span>
          </div>
        </Link>

        <Link
          href="/plants/add"
          className="flex-1 h-full flex items-center justify-center"
        >
          <div className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary rounded-full w-10 h-10 shadow-lg">
            <PlusIcon className="w-5 h-5 text-white" />
          </div>
        </Link>

        <Link href="/calendar" className="flex-1 h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <CalendarIcon
              className={`w-5 h-5 ${
                isActive("/calendar") ? "text-primary" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/calendar") ? "text-primary" : "text-gray-500"
              }`}
            >
              Kalendarz
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
