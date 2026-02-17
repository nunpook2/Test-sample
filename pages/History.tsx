import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/db';
import { Job } from '../types';
import { Search, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

const History: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllJobs().then(setJobs);
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.jobNo.toLowerCase().includes(search.toLowerCase()) || 
    j.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
       <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ประวัติการดำเนินงาน</h1>
        <p className="text-sm text-gray-500">บันทึกรายการเข้า-ออกทั้งหมด {jobs.length} รายการ</p>
      </div>

      <div className="flex gap-2 mb-6">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="ค้นหาเลขที่ใบงาน, พนักงาน..."
            />
         </div>
         <div className="bg-gray-100 rounded-lg p-1 flex">
             <button className="bg-white shadow-sm rounded px-3 py-1 text-xs font-bold text-blue-600">ทั้งหมด</button>
             <button className="px-3 py-1 text-xs font-medium text-gray-500">กำลังดำเนินการ</button>
             <button className="px-3 py-1 text-xs font-medium text-gray-500">เสร็จสิ้น</button>
         </div>
      </div>

      {filteredJobs.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-300">
               <FileText size={64} className="mb-4 opacity-20" />
               <p>ไม่พบข้อมูลบันทึก</p>
           </div>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                     <tr>
                         <th className="px-4 py-3">ใบงาน</th>
                         <th className="px-4 py-3">ประเภท</th>
                         <th className="px-4 py-3">ช่อง</th>
                         <th className="px-4 py-3 text-right">สถานะ</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredJobs.map(job => (
                         <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-3">
                                 <div className="font-bold text-gray-800">{job.jobNo}</div>
                                 <div className="text-xs text-gray-400">{format(parseISO(job.createdAt), 'dd/MM/yy', {locale: th})}</div>
                             </td>
                             <td className="px-4 py-3">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                     job.type === 'D' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                 }`}>
                                     {job.type}
                                 </span>
                             </td>
                             <td className="px-4 py-3 text-gray-600">#{job.slotNumber}</td>
                             <td className="px-4 py-3 text-right">
                                 {job.status === 'processed' ? (
                                     <span className="text-green-600 font-bold text-xs">เสร็จสิ้น</span>
                                 ) : (
                                     <span className="text-orange-500 font-bold text-xs">รอ</span>
                                 )}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
      )}
    </div>
  );
};

export default History;