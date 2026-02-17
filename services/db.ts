import { createClient } from '@libsql/client/web';
import { Job, Employee, ActionType } from '../types';

// Use HTTPS for web client compatibility
const TURSO_URL = 'https://test-chaiyapat.aws-ap-south-1.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzEzMDk3NTMsImlkIjoiZTZjM2MzMTQtZjJlYy00YmZlLWFhZmItMTU2ZWJiYmM2YzExIiwicmlkIjoiOWY4ZjQ5ZTAtODZjZS00N2ZlLWFmNTItMGNiMmE4OWJkMWE1In0.kHVA6PnqcFnHpsplSEWZD4ZAsfd0iA0m0yPlTHqxVKhAKr2dwCnaETw_3FVHHnw-lvmevMRycX_7lnOt3OdrBQ';

export const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const initDB = async (): Promise<boolean> => {
  try {
    // Attempt a simple query to verify connection immediately
    await db.execute("SELECT 1");

    // Jobs Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobNo TEXT NOT NULL,
        employeeId TEXT NOT NULL,
        employeeName TEXT NOT NULL,
        type TEXT NOT NULL,
        slotNumber INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'stored',
        createdAt TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        processedAt TEXT
      )
    `);

    // Employees Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Seed some employees if empty
    const empCheck = await db.execute("SELECT count(*) as count FROM employees");
    if (Number(empCheck.rows[0].count) === 0) {
      await db.execute("INSERT INTO employees (id, name) VALUES ('emp_001', 'สมชาย ใจดี')");
      await db.execute("INSERT INTO employees (id, name) VALUES ('emp_002', 'วิภา รักงาน')");
      await db.execute("INSERT INTO employees (id, name) VALUES ('emp_003', 'Admin Lab')");
    }

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
};

export const getEmployees = async (): Promise<Employee[]> => {
  const result = await db.execute("SELECT * FROM employees ORDER BY name ASC");
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string
  }));
};

export const addEmployee = async (name: string) => {
    const id = `emp_${Date.now()}`;
    await db.execute({
        sql: "INSERT INTO employees (id, name) VALUES (?, ?)",
        args: [id, name]
    });
};

export const updateEmployee = async (id: string, name: string) => {
    await db.execute({
        sql: "UPDATE employees SET name = ? WHERE id = ?",
        args: [name, id]
    });
};

export const deleteEmployee = async (id: string) => {
    await db.execute({
        sql: "DELETE FROM employees WHERE id = ?",
        args: [id]
    });
};

export const getActiveJobs = async (): Promise<Job[]> => {
  const result = await db.execute("SELECT * FROM jobs WHERE status = 'stored'");
  return result.rows.map(row => row as unknown as Job);
};

export const getAllJobs = async (): Promise<Job[]> => {
    const result = await db.execute("SELECT * FROM jobs ORDER BY createdAt DESC LIMIT 100");
    return result.rows.map(row => row as unknown as Job);
};

export const processJob = async (id: number) => {
    const now = new Date().toISOString();
    await db.execute({
        sql: "UPDATE jobs SET status = 'processed', processedAt = ? WHERE id = ?",
        args: [now, id]
    });
}

// Logic to find the next available slot
export const findAvailableSlot = async (type: ActionType): Promise<number | null> => {
  // Get all active jobs for this type
  const result = await db.execute({
    sql: "SELECT slotNumber FROM jobs WHERE type = ? AND status = 'stored'",
    args: [type]
  });

  const counts: Record<number, number> = {};
  // Initialize slots 1-10 with 0
  for (let i = 1; i <= 10; i++) counts[i] = 0;

  // Count current usage
  result.rows.forEach(row => {
    const s = row.slotNumber as number;
    counts[s] = (counts[s] || 0) + 1;
  });

  // Find first slot with < 10 items
  for (let i = 1; i <= 10; i++) {
    if (counts[i] < 10) {
      return i;
    }
  }

  return null; // All full
};

export const createJob = async (jobNo: string, employee: Employee, type: ActionType, slotNumber: number) => {
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 12); // Add 12 days

  await db.execute({
    sql: `INSERT INTO jobs (jobNo, employeeId, employeeName, type, slotNumber, status, createdAt, dueDate)
          VALUES (?, ?, ?, ?, ?, 'stored', ?, ?)`,
    args: [jobNo, employee.id, employee.name, type, slotNumber, now.toISOString(), dueDate.toISOString()]
  });
};