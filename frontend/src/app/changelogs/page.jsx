'use client'
import React from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { useEffect } from 'react';


export default function Changelogs() {
    const {user, loadingUser} = useAuthGuard();

    if (!user || loadingUser) return null;
  

    
    const today = new Date();

  return (
    <div className="flex flex-col items-center p-6">
        <div className="w-full items-center">
            {/* CHANGELOG DATE*/}
            07/May/2025
            <hr />
            <ol className="mt-4 ml-6 text-sm dark:text-gray-200 space-y-2">
                <li className="list-decimal">Fixed issues with stale/duplicating DHCP leases sent from the routers.</li>
                <li className="list-decimal">Added "Changelogs" section to the SideBar component.</li>
                <li className="list-decimal">Added "Copy to clipboard"  button near the 'client hostname' section to the ClientCard component.</li>
            </ol>
        </div>

        
    </div>
  )
}
