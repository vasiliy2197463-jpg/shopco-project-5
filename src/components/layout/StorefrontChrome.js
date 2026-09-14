"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Newsletter from "@/components/layout/Newsletter";
import Footer from "@/components/layout/Footer";

export default function StorefrontChrome({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return children;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow overflow-x-hidden">{children}</main>
      <Newsletter />
      <Footer />
    </>
  );
}
