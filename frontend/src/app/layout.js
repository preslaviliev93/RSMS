import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { ThemeProvider } from "./components/ThemeProvider";
import { UserProvider } from "./context/UserContext";
import {Toaster} from 'react-hot-toast'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Router And Server Management System",
  description: "A simple and easy to use router and server management system"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-[var(--background)] text-[var(--font-color)] min-h-screen ${geistSans.variable} ${geistMono.variable}`}>
      <Toaster position="top-right" />
        <UserProvider>
          <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />

  {/* Right section: scrollable content */}
  <div className="flex flex-col flex-1 overflow-hidden">
    <header className="h-16 border-b border-[var(--border-color)]/20 shadow-sm">
      <TopNav />
    </header>

    {/* This part is scrollable */}
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>

          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
