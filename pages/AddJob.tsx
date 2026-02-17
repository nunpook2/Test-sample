import React, { useState, useEffect } from 'react';
import { getEmployees, createJob, findAvailableSlot } from '../services/db';
import { Trash2, PackageCheck, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { ActionType, Employee } from '../types';
import { useNavigate } from 'react-router-dom';

const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobNo, setJobNo] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [type, setType] = useState<ActionType>('D'); // Default to Dispose
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  const handleSubmit = async () => {
    if (!jobNo.trim() || !selectedEmployee) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Find Slot
      const slot = await findAvailableSlot(type);
      
      if (!slot) {
        setError(`ไม่มีช่องว่างสำหรับรายการ ${type === 'D' ? 'ทิ้ง (Dispose)' : 'ส่งคืน (Return)'} แล้ว (เต็มทุกช่อง)`);
        setLoading(false);
        return;
      }

      // 2. Create Job
      const emp = employees.find(e => e.id === selectedEmployee);
      if (!emp) throw new Error("Employee not found");

      await createJob(jobNo, emp, type, slot);

      setSuccess(`บันทึกสำเร็จ! เก็บที่ช่อง ${slot} (${type === 'D' ? 'ทิ้ง' : 'ส่งคืน'})`);
      setJobNo(''); // Reset form
      setSelectedEmployee('');
      
      // Auto dismiss success and maybe redirect or just stay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">รับตัวอย่างใหม่</h1>
        <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลเพื่อรับเลขที่ช่องเก็บอัตโนมัติ</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Input: Job No */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">เลขที่ใบงาน (Job No.)</label>
          <input
            type="text"
            value={jobNo}
            onChange={(e) => setJobNo(e.target.value)}
            placeholder="เช่น 2603XXXX"
            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium text-gray-700 placeholder-gray-300"
          />
        </div>

        {/* Input: Employee */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">พนักงานผู้คีย์</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium text-gray-700"
          >
            <option value="">-- เลือกชื่อพนักงาน --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Input: Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">เลือกประเภทการจัดการ</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setType('D')}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                type === 'D' 
                  ? 'border-red-500 bg-red-50 text-red-600 shadow-sm' 
                  : 'border-gray-100 bg-white text-gray-300 hover:border-gray-200'
              }`}
            >
              <Trash2 size={28} />
              <span className="font-bold text-sm">ทิ้ง (D)</span>
            </button>

            <button
              onClick={() => setType('R')}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                type === 'R' 
                  ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' 
                  : 'border-gray-100 bg-white text-gray-300 hover:border-gray-200'
              }`}
            >
              <PackageCheck size={28} />
              <span className="font-bold text-sm">ส่งคืน (R)</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
        )}
        {success && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle size={16} /> {success}
            </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-14 rounded-xl flex items-center justify-center space-x-2 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          <span>{loading ? 'กำลังบันทึก...' : 'บันทึกรับงาน'}</span>
          {!loading && <ChevronRight size={20} />}
        </button>

      </div>

      <div className="mt-8 text-gray-400 text-xs flex items-center gap-1">
        <AlertCircle size={12} />
        <span>ความจุ: สูงสุด 10 ใบงานต่อช่อง</span>
      </div>
    </div>
  );
};

export default AddJob;