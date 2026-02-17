import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, deleteEmployee } from '../services/db';
import { Employee } from '../types';
import { UserPlus, Trash, Shield, Info, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [trialMode, setTrialMode] = useState(true);

  useEffect(() => {
    loadEmp();
  }, []);

  const loadEmp = () => {
    getEmployees().then(setEmployees);
  };

  const handleAdd = async () => {
    if (newEmpName.trim()) {
        await addEmployee(newEmpName);
        setNewEmpName('');
        loadEmp();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ต้องการลบพนักงานรายนี้?")) {
        await deleteEmployee(id);
        loadEmp();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
        <p className="text-sm text-gray-500">จัดการผู้ใช้งานและโหมดการทำงาน</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <Shield size={18} className="text-blue-500" /> โหมดการใช้งาน
              </h3>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" checked={trialMode} onChange={() => setTrialMode(!trialMode)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-500 checked:right-0 right-6"/>
                <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${trialMode ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
            </div>
          </div>
          <div className="p-4 bg-blue-50 text-blue-800 text-xs flex gap-2">
              <Info size={16} className="shrink-0" />
              {trialMode ? 'ระบบกำลังทำงานในโหมดทดลอง (Trial). ข้อมูลอาจถูกรีเซ็ตได้' : 'ระบบทำงานในโหมดจริง (Production)'}
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">รายชื่อพนักงาน</h3>
          </div>
          
          <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                  <input 
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="ชื่อพนักงานใหม่..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button onClick={handleAdd} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
                      <UserPlus size={18} />
                  </button>
              </div>
          </div>

          <div className="divide-y divide-gray-100">
              {employees.map(emp => (
                  <div key={emp.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="font-medium text-gray-700">{emp.name}</div>
                      <button onClick={() => handleDelete(emp.id)} className="text-red-400 hover:text-red-600 p-2">
                          <Trash size={16} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-red-500 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
            <LogOut size={16} /> ออกจากระบบ
        </button>
        <p className="text-xs text-gray-300 mt-4">Version 1.0.0 (Build 2024.1)</p>
      </div>
    </div>
  );
};

export default SettingsPage;