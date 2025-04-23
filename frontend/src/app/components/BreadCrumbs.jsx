'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname) return null;

  const pathParts = pathname.split('/').filter(Boolean);
  const buildPath = (index) => '/' + pathParts.slice(0, index + 1).join('/');

  return (
    <nav className="flex text-gray-400 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
        </li>

        {pathParts.map((part, index) => (
          <li key={index}>
            <div className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>

              {index !== pathParts.length - 1 ? (
                <Link
                  href={buildPath(index)}
                  className="hover:text-gray-200 capitalize"
                >
                  {part.replace(/-/g, ' ')}
                </Link>
              ) : (
                <span className="text-gray-500 capitalize">
                  {part.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
