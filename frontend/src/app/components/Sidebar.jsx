'use client';
import React, { useState, useEffect } from 'react';
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
  CircleUserRound, UserPen, KeyRound,
  LogOut, Monitor, MapPinCheck
} from 'lucide-react';

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState('');
  const router = useRouter();
  const { logout } = useUser();
  const { user, loadingUser, checking } = useAuthGuardForUI();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      const userRole = JSON.parse(localStorage.getItem("userData") || "{}").role || "";
      setRole(userRole);
    }
  }, [user, loadingUser, checking]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!mounted || checking || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <img src="/loading.svg" alt="Loading..." className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <aside className={`
      flex flex-col h-screen bg-[#f8f8f8] dark:bg-[#121212]
      border-r border-[var(--border-color)]/20 shadow-sm transition-all duration-300
      ${collapsed ? 'w-[64px]' : 'w-[220px]'}
    `}>
      {/* Logo */}
      <div className="flex flex-col items-center py-4 px-2 gap-2">
        <Image src="/logo1.png" alt="Logo" width={40} height={40} />
        {!collapsed && (
          <h2 className="text-center font-bold text-lg text-gray-800 dark:text-gray-200">
            RSMS
          </h2>
        )}
        <CollapseToggleButton collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-2 space-y-2 text-center">
        {!collapsed && <SidebarSectionTitle>Dashboard</SidebarSectionTitle>}
        {user && (
          <>
            <CustomIconLink href="/home" icon={<Home />} text="Home" collapsed={collapsed} />
            <CustomIconLink href="/profile" icon={<UserPen />} text="My Profile" collapsed={collapsed} />
          </>
        )}
        {!user && (
          <CustomIconLink href="/login" icon={<KeyRound />} text="Login" collapsed={collapsed} />
        )}

        {user && (
          <>
            {!collapsed && <SidebarSectionTitle>Clients</SidebarSectionTitle>}
            <CustomIconLink href="/clients" icon={<CircleUserRound />} text="Clients" collapsed={collapsed} />

            {!collapsed && <SidebarSectionTitle>Network</SidebarSectionTitle>}
            <CustomIconLink href="/routers" icon={<Router />} text="Routers" collapsed={collapsed} />
            <CustomIconLink href="/servers" icon={<Server />} text="Servers" collapsed={collapsed} />
            <CustomIconLink href="/locations" icon={<MapPinCheck />} text="Locations" collapsed={collapsed} />
            <CustomIconLink href="/machines" icon={<Monitor />} text="Machines" collapsed={collapsed} />
            {role === 'admin' && (
              <CustomIconLink href="/logs" icon={<FileText />} text="Logs" collapsed={collapsed} />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 w-full px-2 py-4 bg-inherit flex flex-col items-center gap-2">
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#ccc] dark:hover:bg-[#2c2c2c] transition-colors duration-200 rounded w-full"
          >
            <span className="flex items-center justify-center w-6 h-6"><LogOut /></span>
            {!collapsed && <span className="hidden md:inline">Logout</span>}
          </button>
        )}
        <ThemeToggleButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
