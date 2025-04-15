"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Home, Server, Router, User, FileText, Map, Menu, CircleUserRound, SunMoon, UserPen, ChartArea } from "lucide-react";
import CustomIconLink from "./CustomIconLink";
import SidebarSectionTitle from "./SidebarSectionTitle";
import ThemeToggleButton from "./ThemeToggleButton";


export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside className="
  h-full bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-200 shadow-lg 
  p-4 w-16 md:w-20 lg:w-64 xl:w-72 transition-all duration-300
">
      <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 hidden lg:block">
        Dashboard
      </h2>
      </div>

      <CustomIconLink href="/" icon={<Home />} text="Home" />
      <CustomIconLink href="/" icon={<UserPen />} text="My Profile" />
      
      <SidebarSectionTitle>Clients</SidebarSectionTitle>
      <CustomIconLink href="/" icon={<CircleUserRound />} text="Clients" />
      <CustomIconLink href="/" icon={<ChartArea />} text="Client Statistics" />

      <SidebarSectionTitle>Network</SidebarSectionTitle>
      <CustomIconLink href="/" icon={<Router />} text="Routers" />
      <CustomIconLink href="/servers" icon={<Server />} text="Servers" />
      <CustomIconLink href="/" icon={<FileText />} text="Logs" />

      <ThemeToggleButton />
    </aside>
  );
}