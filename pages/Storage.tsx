import React, { useEffect, useState } from 'react';
import { getActiveJobs } from '../services/db';
import { Job, ActionType } from '../types';
import { Trash2, RotateCcw, Search, AlertTriangle } from 'lucide-react';

const Storage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [viewType, setViewType] = useState<ActionType>('D'); // D or R view
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getActiveJobs().then(setJobs);
  }, [refreshKey]);

  // Group jobs by slot
  const getSlotData = (slotNum: number) => {
    const slotJobs = jobs.filter(j => j.type === viewType && j.slotNumber === slotNum);
    return {
      count: slotJobs.length,
      jobs: slotJobs
    };
  };

  // Helper to get color theme
  const theme = viewType === 'D' 
    ? { 
        main: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-100',
        badge: 'bg-red-100 text-red-700',
        icon: Trash2,
        label: 'โซนตัวอย่างรอทิ้ง (D)'
      }
    : { 
        main: 'text-blue-600', 
        bg: 'bg-blue-50', 
        border: 'border-blue-100',
        badge: 'bg-blue-100 text-blue-700',
        icon: RotateCcw,
        label: 'โซนตัวอย่างรอส่งคืน (R)'
      };

  const Icon = theme.icon;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ผังที่เก็บ & สืบค้นประวัติ</h1>
        <p className="text-sm text-gray-500">ตรวจสอบตำแหน่งปัจจุบันและค้นหาประวัติการจัดการย้อนหลัง</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          placeholder="ค้นหาเลขที่ใบงาน / ชื่อพนักงาน / หมายเหตุ..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setViewType('D')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${viewType === 'D' ? 'bg-white border-red-200 text-red-600 shadow-sm' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-white'}`}
        >
          <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs mr-2 font-bold">D</span>
          = Dispose (ทิ้งตัวอย่าง)
        </button>
        <button
          onClick={() => setViewType('R')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${viewType === 'R' ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-white'}`}
        >
          <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs mr-2 font-bold">R</span>
          = Return (ส่งคืนลูกค้า)
        </button>
        <div className="px-4 py-2 rounded-lg text-sm font-medium border border-yellow-100 bg-yellow-50 text-yellow-700 flex items-center gap-2">
            <AlertTriangle size={14} />
            มีรายการครบกำหนด/เกินเวลา
        </div>
      </div>

      {/* Grid Header */}
      <div className={`flex items-center gap-2 mb-4 text-lg font-bold ${theme.main}`}>
        <Icon size={24} />
        <h2>{theme.label}</h2>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-20">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
          const { count, jobs: slotJobs } = getSlotData(num);
          const isFull = count >= 10;
          
          return (
            <div 
                key={num} 
                className={`relative bg-white rounded-xl border p-4 flex flex-col items-center justify-between aspect-square transition-shadow hover:shadow-md ${isFull ? 'border-gray-300 bg-gray-50' : theme.border}`}
            >
              <div className="w-full flex justify-between items-start">
                 <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${theme.badge}`}>
                    {viewType === 'D' ? 'ทิ้ง' : 'ส่งคืน'}
                 </span>
                 <span className="text-gray-300 font-bold text-xl">#{num}</span>
              </div>
              
              <div className="text-center">
                <span className={`text-4xl font-bold ${count > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                    {count}
                </span>
                <p className="text-xs text-gray-400 mt-1">ใบงาน / 10</p>
              </div>

              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div 
                    className={`h-full ${viewType === 'D' ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{ width: `${(count / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Storage;