'use client';
import { useTheme } from 'next-themes';
import { SunMoon } from 'lucide-react';

export default function ThemeToggleButton() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-center md:justify-start gap-4 px-2 py-2 mt-6 text-sm hover:bg-[#ececec] ext-[#121212] dark:text-gray-200 dark:hover:bg-[#2c2c2c] transition-colors duration-200 rounded"
    >
        <SunMoon className="w-5 h-5" />
        <span className="hidden lg:inline">
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
    </button>

  );
}
