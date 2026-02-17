import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import AddJob from './pages/AddJob';
import Storage from './pages/Storage';
import Tasks from './pages/Tasks';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import { initDB } from './services/db';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const initialize = async () => {
      const success = await initDB();
      if (success) {
        setAppState('ready');
      } else {
        setAppState('error');
      }
    };
    initialize();
  }, []);

  if (appState === 'loading') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 gap-4">
         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
         <div className="text-gray-500 font-medium">กำลังโหลดข้อมูลระบบ...</div>
      </div>
    );
  }

  if (appState === 'error') {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-red-50 p-6 text-center">
            <div className="text-red-500 font-bold text-xl mb-2">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</div>
            <p className="text-gray-600 mb-4">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือติดต่อผู้ดูแลระบบ</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
            >
                ลองใหม่
            </button>
        </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AddJob />} />
          <Route path="storage" element={<Storage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;