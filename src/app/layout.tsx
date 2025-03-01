import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomNavigation from "@/components/BottomNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlantCare",
  description: "Aplikacja do przypominania o podlewaniu i zraszaniu roślin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f0fdf5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-background min-h-screen pb-16`}>
        <ToastContainer
          position="top-center"
          toastClassName="rounded-lg shadow-lg"
        />
        <main className="pb-16">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
