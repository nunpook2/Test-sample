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
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initDB();
      setDbReady(true);
    };
    initialize();
  }, []);

  if (!dbReady) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 gap-4">
         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
         <div className="text-gray-500 font-medium">กำลังโหลดข้อมูลระบบ...</div>
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