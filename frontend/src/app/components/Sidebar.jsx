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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <aside className={`
      flex flex-col
      bg-[#121212] text-gray-200
      shadow-lg p-4 transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64 md:w-72 lg:w-80 xl:w-[22rem]'}
    `}>
    
    
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
      >
        {collapsed ? (
          <span className="flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        ) : (
          <span className="flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        )}
      </button>

      <div className="flex w-full gap-4 items-center mb-8">
        <Image src="/logo1.png" alt="Logo" width={40} height={40} className="" />
        {!collapsed && <h2 className="font-bold text-lg hidden lg:block lg:text-xl xl:text-2xl text-gray-800 dark:text-gray-200">RSMS</h2>}
        
      </div>

      <CustomIconLink href="/" icon={<Home />}  text="Home"  collapsed={collapsed} />
      {user && <CustomIconLink href="/" icon={<UserPen />} text="My Profile" collapsed={collapsed} />}
      {!user && <CustomIconLink href="/login" icon={<KeyRound />} text="Login" collapsed={collapsed} />}

      {user && (
        <>
          {!collapsed && <SidebarSectionTitle>Clients</SidebarSectionTitle>}
          <CustomIconLink href="/" icon={<CircleUserRound />} text="Clients" collapsed={collapsed} />
          <CustomIconLink href="/" icon={<ChartArea />} text="Client Statistics" collapsed={collapsed} />

          {!collapsed && <SidebarSectionTitle>Network</SidebarSectionTitle>}
          <CustomIconLink href="/" icon={<Router />} text="Routers" collapsed={collapsed} />
          <CustomIconLink href="/servers" icon={<Server />} text="Servers" collapsed={collapsed} />
          <CustomIconLink href="/" icon={<FileText />} text="Logs" collapsed={collapsed} />

          <button
            onClick={handleLogout}
            className="my-2 flex items-center md:justify-start justify-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#2c2c2c] transition-colors duration-200 rounded w-full"
          >
            <span className="flex items-center justify-center w-6 h-6"><LogOut /></span>
            {!collapsed && <span className="hidden lg:inline">Logout</span>}
          </button>

        </>
      )}
      <ThemeToggleButton collapsed={collapsed}/>
    </aside>
  );
}



// FIX LABELS AND LOGO AND TITLE