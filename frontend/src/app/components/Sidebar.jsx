'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Home, Server, Router, FileText, CircleUserRound, UserPen, ChartArea, KeyRound, LogOut } from 'lucide-react';
import CustomIconLink from './CustomIconLink';
import SidebarSectionTitle from './SidebarSectionTitle';
import ThemeToggleButton from './ThemeToggleButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthGuardForUI } from '../hooks/useAuthGuardForUI';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const [mounted, setMounted] = useState(false); 
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { user, loadingUser, checking } = useAuthGuardForUI();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || checking || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <img src="/loading.svg" alt="Loading..." className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <aside className="h-full bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-200 shadow-lg p-4 w-16 md:w-20 lg:w-64 xl:w-72 transition-all duration-300">
      <div className="flex w-full gap-4 items-center mb-8">
        <Image src="/logo1.png" alt="Logo" width={40} height={40} className="" />
        <h2 className="font-bold text-lg hidden lg:block lg:text-xl xl:text-2xl text-gray-800 dark:text-gray-200">RSMS</h2>
      </div>

      <CustomIconLink href="/" icon={<Home />} text="Home" />
      {user && <CustomIconLink href="/" icon={<UserPen />} text="My Profile" />}
      {!user && <CustomIconLink href="/login" icon={<KeyRound />} text="Login" />}

      {user && (
        <>
          <SidebarSectionTitle>Clients</SidebarSectionTitle>
          <CustomIconLink href="/" icon={<CircleUserRound />} text="Clients" />
          <CustomIconLink href="/" icon={<ChartArea />} text="Client Statistics" />

          <SidebarSectionTitle>Network</SidebarSectionTitle>
          <CustomIconLink href="/" icon={<Router />} text="Routers" />
          <CustomIconLink href="/servers" icon={<Server />} text="Servers" />
          <CustomIconLink href="/" icon={<FileText />} text="Logs" />

          <button
            onClick={handleLogout}
            className="my-2 flex items-center md:justify-start justify-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#2c2c2c] transition-colors duration-200 rounded w-full"
          >
            <span className="flex items-center justify-center w-6 h-6"><LogOut /></span>
            <span className="hidden lg:inline">Logout</span>
          </button>
        </>
      )}
      <ThemeToggleButton />
    </aside>
  );
}
