import React, { useEffect, useState } from 'react';
import { getActiveJobs, processJob } from '../services/db';
import { Job } from '../types';
import { Calendar, Search, CheckCircle, Trash2, RotateCcw, Clock } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { th } from 'date-fns/locale';

const Tasks: React.FC = () => {
  const [dueJobs, setDueJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const jobs = await getActiveJobs();
    const today = new Date();
    
    // Filter jobs where dueDate is past or today
    const filtered = jobs.filter(j => {
      const due = parseISO(j.dueDate);
      return due <= today; 
    });
    
    // Sort by due date ascending (most overdue first)
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    setDueJobs(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcess = async (id: number) => {
    if (window.confirm('ยืนยันว่าจัดการรายการนี้แล้ว?')) {
        await processJob(id);
        fetchData(); // Refresh
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">รายการที่ต้องจัดการวันนี้</h1>
        <p className="text-sm text-gray-500">พักครบ 12 วันแล้ว ({dueJobs.length} รายการ)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 flex items-center">
        <Search className="text-gray-400 ml-2" size={20} />
        <input 
            type="text" 
            placeholder="ค้นหาเลขที่ใบงาน..." 
            className="w-full p-2 outline-none text-gray-600"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : dueJobs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-400">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p>ไม่มีรายการที่ต้องจัดการ</p>
        </div>
      ) : (
        <div className="space-y-4">
            {dueJobs.map(job => {
                const daysOverdue = differenceInDays(new Date(), parseISO(job.dueDate));
                
                return (
                    <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    job.type === 'D' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {job.type === 'D' ? 'ทิ้ง (D)' : 'คืน (R)'}
                                </span>
                                <span className="font-bold text-gray-800">{job.jobNo}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> ครบกำหนด: {format(parseISO(job.dueDate), 'dd MMM yyyy', { locale: th })}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                ช่องเก็บ: <b>#{job.slotNumber}</b> • โดย {job.employeeName}
                            </div>
                             {daysOverdue > 0 && (
                                <div className="text-xs text-red-500 font-bold mt-1">
                                    เกินกำหนด {daysOverdue} วัน
                                </div>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => handleProcess(job.id)}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-md"
                        >
                            <CheckCircle size={20} />
                        </button>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default Tasks;