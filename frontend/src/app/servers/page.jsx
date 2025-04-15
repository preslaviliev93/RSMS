'use client';
import ServersTable from "../components/ServersTable";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function Page() {
  const { user, loadingUser, checking } = useAuthGuard();

  if (loadingUser || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <img src="/loading.svg" alt="Loading..." className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Servers</h1>
      <ServersTable />
    </div>
  );
}