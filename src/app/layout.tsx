import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Sidebar } from "~/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "ACE",
  description: "ACE Management System",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Sidebar />
            <main className="flex-1 ml-72">
              {children}
            </main>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
