'use client';
import Link from 'next/link';

export default function CustomIconLink({ icon, text, href, collapsed }) {
  return (
    <Link
      href={href}
      className="my-2 flex items-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 hover:bg-[#ccc] dark:hover:bg-[#2c2c2c] transition-colors duration-200 rounded"
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      {!collapsed && <span className="hidden md:inline">{text}</span>}
    </Link>
  );
}
