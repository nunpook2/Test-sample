export type ActionType = 'D' | 'R'; // D = Dispose (ทิ้ง), R = Return (ส่งคืน)

export type JobStatus = 'stored' | 'processed';

export interface Employee {
  id: string; // generated UUID or simple string
  name: string;
}

export interface Job {
  id: number; // primary key
  jobNo: string;
  employeeId: string;
  employeeName: string; // Denormalized for display ease
  type: ActionType;
  slotNumber: number; // 1-10
  status: JobStatus;
  createdAt: string; // ISO String
  dueDate: string; // ISO String (Created + 12 days)
  processedAt?: string; // ISO String
}

export interface SlotStatus {
  slotNumber: number;
  count: number;
  jobs: Job[];
  isFull: boolean;
}