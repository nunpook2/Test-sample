import React, { useEffect, useState } from 'react';
import { getActiveJobs, getAllJobs } from '../services/db';
import { Job } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    getActiveJobs().then(setActiveJobs);
    getAllJobs().then(setAllJobs);
  }, []);

  const disposeCount = activeJobs.filter(j => j.type === 'D').length;
  const returnCount = activeJobs.filter(j => j.type === 'R').length;
  
  const data = [
    { name: 'Dispose', value: disposeCount, color: '#EF4444' },
    { name: 'Return', value: returnCount, color: '#3B82F6' },
  ];

  // Dummy activity data
  const activityData = [
    { name: 'จ', uv: 4 },
    { name: 'อ', uv: 3 },
    { name: 'พ', uv: 7 },
    { name: 'พฤ', uv: 5 },
    { name: 'ศ', uv: 8 },
    { name: 'ส', uv: 2 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">LabMaster (Cloud)</h1>
            <p className="text-sm text-gray-500">ภาพรวมระบบจัดการตัวอย่าง</p>
         </div>
         <Link to="/settings" className="p-2 bg-white rounded-full shadow-sm text-gray-600">
            <Settings size={20} />
         </Link>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div className="text-gray-400 text-xs font-bold uppercase mb-1">งานคงค้างทั้งหมด</div>
             <div className="text-3xl font-bold text-gray-800">{activeJobs.length}</div>
             <div className="text-xs text-green-500 mt-1">+2 จากเมื่อวาน</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div className="text-gray-400 text-xs font-bold uppercase mb-1">เสร็จสิ้นเดือนนี้</div>
             <div className="text-3xl font-bold text-gray-800">{allJobs.filter(j => j.status === 'processed').length}</div>
             <div className="text-xs text-gray-400 mt-1">รายการ</div>
          </div>
       </div>

       {/* Chart Section */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-700 mb-4">สัดส่วนงานคงค้าง (D/R)</h3>
          <div className="h-48 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={data} 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute text-center">
                 <div className="text-2xl font-bold text-gray-800">{activeJobs.length}</div>
                 <div className="text-xs text-gray-400">Total</div>
             </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Dispose ({disposeCount})</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Return ({returnCount})</span>
              </div>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;