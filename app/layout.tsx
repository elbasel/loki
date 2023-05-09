import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat",
  description: "Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="text-white bg-slate-900">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
