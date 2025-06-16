"use client"
import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
function Topbar() {

  return (
    <div className="sticky top-0 z-[200] bg-white shadow-sm p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <h1 className="text-lg font-medium text-gray-800">
            Welcome, <span className="font-semibold">User</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Image 
                src="/avatar/avatar.avif" 
                alt="avatar" 
                width={36}
                height={36}
                className="object-cover"
              />
              </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;