'use client';
import { useTheme } from 'next-themes';
import { SunMoon } from 'lucide-react';

export default function ThemeToggleButton({ collapsed }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#2c2c2c] transition-colors duration-200 rounded mt-4 md:justify-start justify-center"
    >
      <span className="flex items-center justify-center w-6 h-6">
        <SunMoon className="w-5 h-5" />
      </span>
      {!collapsed && (
        <span className="hidden lg:inline">
          {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
