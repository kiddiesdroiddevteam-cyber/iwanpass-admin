'use client';

import { useMemo, useState, useEffect } from 'react';
import { DashbaordComponent } from '@/components/dashboard'; // Ensure this matches your filename
import { Header } from '@/components/Header';
import { Paragraph } from '@/components/Paragraph';
import { getAuthHeaders } from '@/lib/apiClient';

type Student = {
  id: string;
  name: string;
  avgScore: number;
  quizzesTaken: number;
  status: 'Active' | 'Inactive';
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://past-questions-api.onrender.com/api/users/', {
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        
        // Handle variations in API response structures
        const rawList = Array.isArray(data) ? data : data.users || data.data || [];
        
        // Map data to ensure it matches our Student type (handling _id or different field names)
        const formattedList: Student[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || item.fullName || 'Unknown Student',
          avgScore: item.avgScore || item.averageScore || 0,
          quizzesTaken: item.quizzesTaken || item.quizCount || 0,
          status: item.status === 'Active' ? 'Active' : 'Inactive',
        }));

        setStudents(formattedList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle delete student
  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`https://past-questions-api.onrender.com/api/users/${studentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete student');
      
      // Update local state
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q);
    });
  }, [query, statusFilter, students]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex h-full min-h-screen">
      <div style={{ borderRight: '1px solid #E4E7EC' }} className="bg-white">
        <DashbaordComponent />
      </div>

      <main className="flex-1 p-8 bg-[rgba(228,231,236,0.2)]">
        <div className="max-w-full">
          <div className="mb-6">
            <Header text="User Management" />
            <Paragraph text="View and manage all students" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search students by name..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #E6E9EE' }}>
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-500">Loading students...</div>
            ) : (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-gray-600 bg-gray-50">
                      <th className="py-4 pl-6 font-semibold">Student</th>
                      <th className="py-4 font-semibold">Avg Score</th>
                      <th className="py-4 font-semibold">Quizzes taken</th>
                      <th className="py-4 font-semibold">Status</th>
                      <th className="py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                            {s.name ? s.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : '??'}
                          </div>
                          <div className="font-medium text-sm text-gray-900">{s.name}</div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{s.avgScore}%</td>
                        <td className="py-4 text-sm text-gray-600">{s.quizzesTaken}</td>
                        <td className="py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            s.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : 'bg-gray-50 text-gray-600 border border-gray-100'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm">
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                            title="Delete student"
                          >
                            <span className="text-xl">⋮</span>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {visible.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-sm text-gray-500">
                          No students found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{visible.length}</span> of <span className="font-medium">{total}</span> students
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
                      disabled={page === 1}
                    >
                      Prev
                    </button>
                    <div className="px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-700 font-medium">
                      {page}
                    </div>
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      className="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
                      disabled={page === pages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}