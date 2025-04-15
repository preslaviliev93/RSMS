'use client';
import Link from 'next/link';

export default function CustomIconLink({ icon, text, href }) {
    return (
      <Link
        href={href}
        className="my-2 flex hover:bg-[#ececec] items-center md:justify-start justify-center gap-4 px-2 py-2 text-sm text-[#121212] dark:text-gray-200 
           dark:hover:bg-[#2c2c2c] transition-colors duration-200 rounded"
      >
        <span className="flex items-center justify-center w-6 h-6">
          {icon}
        </span>
        {/* Only show text on lg and up */}
        <span className="hidden lg:inline">{text}</span>
      </Link>
    );
  }
  