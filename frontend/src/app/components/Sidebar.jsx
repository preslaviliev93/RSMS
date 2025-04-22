'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useAuthGuardForUI } from '../hooks/useAuthGuardForUI';
import { useUser } from '../context/UserContext';
import CustomIconLink from './CustomIconLink';
import SidebarSectionTitle from '../components/SidebarSectionTitle';
import ThemeToggleButton from '../components/ThemeToggleButton';
import Image from 'next/image';
import CollapseToggleButton from '../components/CollapseToggleButton';

import {
  Home, Server, Router, FileText,
  CircleUserRound, UserPen, ChartArea,
  KeyRound, LogOut
} from 'lucide-react'

export default function Sidebar() {
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();
  const { user, loadingUser, checking } = useAuthGuardForUI();
  const { logout } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState("");

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      const userRole = JSON.parse(localStorage.getItem("userData") || "{}").role || "";

    }
  }, [user, loadingUser, checking]);

  if (!mounted || checking || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <img src="/loading.svg" alt="Loading..." className="w-16 h-16 animate-spin" />
      </div>
    );
  }


  return (
    <aside className={`
      flex flex-col h-screen flex-shrink-0
      bg-[#f8f8f8] dark:bg-[#121212]

      border-r border-[var(--border-color)]/20 shadow-sm
      transition-all duration-300 ease-in-out
      items-center sm:items-start
      px-2 py-4
      
    `}>
    
    
    
    
  {/* Sidebar content */}

 

     
         <div className="flex items-center gap-2">
         <Image src="/logo1.png" alt="Logo" width={40} height={40} className="" />
         {!collapsed && <h2 className="font-bold text-lg hidden md:block lg:text-xl xl:text-2xl text-gray-800 dark:text-gray-200">RSMS</h2>}  
         </div>
         
   
      {!collapsed && <SidebarSectionTitle>Dashboard</SidebarSectionTitle>}
      <div className="hidden md:flex items-center">
        <CollapseToggleButton collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
     
      {!collapsed && <SidebarSectionTitle>Navigation</SidebarSectionTitle>}
      <CustomIconLink href="/" icon={<Home />}  text="Home"  collapsed={collapsed} />
      {user && <CustomIconLink href="/" icon={<UserPen />} text="My Profile" collapsed={collapsed} />}
      {!user && <CustomIconLink href="/login" icon={<KeyRound />} text="Login" collapsed={collapsed} />}

      {user && (
        <>
          {!collapsed && <SidebarSectionTitle>Clients</SidebarSectionTitle>}
          <CustomIconLink href="/clients" icon={<CircleUserRound />} text="Clients" collapsed={collapsed} />
          <CustomIconLink href="/" icon={<ChartArea />} text="Client Statistics" collapsed={collapsed} />

          {!collapsed && <SidebarSectionTitle>Network</SidebarSectionTitle>}
          <CustomIconLink href="/routers" icon={<Router />} text="Routers" collapsed={collapsed} />
          <CustomIconLink href="/servers" icon={<Server />} text="Servers" collapsed={collapsed} />
          <CustomIconLink href="/" icon={<FileText />} text="Logs" collapsed={collapsed} />

          <button
            onClick={handleLogout}
            className="my-2 flex items-center md:justify-start justify-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#2c2c2c] transition-colors duration-200 rounded w-full"
          >
            <span className="flex items-center justify-center w-6 h-6"><LogOut /></span>
            {!collapsed && <span className="hidden md:inline">Logout</span>}
          </button>

        </>
      )}
      <ThemeToggleButton collapsed={collapsed}/>
</aside>


  )
}
