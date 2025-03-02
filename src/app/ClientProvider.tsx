"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import PWARegister from "./pwa-register";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PWARegister />
      <ToastContainer
        position="top-center"
        toastClassName="rounded-lg shadow-lg"
      />
      <main className="pb-16">{children}</main>
      <BottomNavigation />
    </>
  );
}
