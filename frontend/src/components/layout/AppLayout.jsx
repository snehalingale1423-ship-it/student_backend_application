import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { Notice } from '../common/Notice.jsx';
import { useStudents } from '../../context/StudentContext.jsx';

export const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { notification, clearNotification } = useStudents();

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex flex-col antialiased">
      <Sidebar
        isMobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col md:pl-64 transition-all">
        <Topbar onOpenMobile={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {notification && (
        <Notice
          message={notification.message}
          type={notification.type}
          onDismiss={clearNotification}
        />
      )}
    </div>
  );
};
