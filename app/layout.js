import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BMS URPASH",
  description: "Boys Middle School Urpash",
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
