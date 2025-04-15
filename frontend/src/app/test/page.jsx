'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[DEBUG] html class:', document.documentElement.className);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8 transition-colors bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Dark Mode Test Page</h1>

      <div className="mb-4 p-4 rounded bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        This box should change color in dark mode.
      </div>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme (Current: {theme})
      </button>
    </div>
  );
}
