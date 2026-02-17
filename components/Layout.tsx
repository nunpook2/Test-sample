import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, Box, PlusCircle, Clock, FileText } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavLink
            to="/storage"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/storage') ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Box size={20} strokeWidth={isActive('/storage') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">ผังที่เก็บ</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <LayoutGrid size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">แผงควบคุม</span>
          </NavLink>

          {/* Center Action Button */}
          <div className="relative -top-5">
            <NavLink
              to="/"
              className="flex flex-col items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg text-white hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={32} />
            </NavLink>
            <div className="text-center text-[10px] font-medium text-blue-600 mt-1">เพิ่มใบงาน</div>
          </div>

          <NavLink
            to="/tasks"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/tasks') ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Clock size={20} strokeWidth={isActive('/tasks') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">รอจัดการ</span>
          </NavLink>

          <NavLink
            to="/history"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/history') ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <FileText size={20} strokeWidth={isActive('/history') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">ประวัติ</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};