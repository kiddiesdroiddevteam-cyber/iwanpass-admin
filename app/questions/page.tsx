"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getMultipartHeaders } from '@/lib/apiClient';
import JsonEditor from '@/components/JsonEditor';
import { DashbaordComponent } from '@/components/dashboard';

export const dynamic = 'force-dynamic';

type FilterState = { subject: string; examType: string; examYear: string };
type OptionItem = { subject: string; examType: string; years: Array<number | string> };
type QuestionItem = { _id: string } & Record<string, any>;

export default function QuestionsPage() {
  const [filters, setFilters] = useState<FilterState>({ subject: '', examType: '', examYear: '' });
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://past-questions-api.onrender.com/api/questions';
  const axiosConfig = { headers: getMultipartHeaders() };

  const fetchMetadata = async () => {
    try {
      const res = await axios.get(`${API_URL}/subjects-years`, axiosConfig);
      setOptions(res.data);
    } catch (err: any) {
      console.error('Error fetching metadata', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const uniqueSubjects = useMemo(
    () => [...new Set(options.map((o) => o.subject))],
    [options]
  );

  const availableExamTypes = useMemo(
    () => options.filter((opt) => opt.subject === filters.subject).map((opt) => opt.examType),
    [options, filters.subject]
  );

  const availableYears = useMemo(
    () =>
      options.find((opt) => opt.subject === filters.subject && opt.examType === filters.examType)?.years || [],
    [options, filters.subject, filters.examType]
  );

  const fetchQuestions = async () => {
    setLoading(true);
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    const params = new URLSearchParams(activeFilters).toString();

    try {
      const res = await axios.get(`${API_URL}?${params}`, axiosConfig);
      const data: QuestionItem[] = res.data.data;
      setQuestions(data);
      setOriginalQuestions(JSON.parse(JSON.stringify(data)));
    } catch (err: any) {
      alert('Fetch error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUpdates = () => {
    return questions.filter((current) => {
      const original = originalQuestions.find((q) => q._id === current._id);
      return JSON.stringify(current) !== JSON.stringify(original);
    });
  };

  const dirtyCount = getUpdates().length;

  const handleSave = async () => {
    const updates = getUpdates();
    if (updates.length === 0) return alert('No changes detected.');

    try {
      setLoading(true);
      const res = await axios.patch(`${API_URL}/bulk`, { updates }, axiosConfig);
      alert(`Success! Updated ${res.data.modified} questions.`);
      setOriginalQuestions(JSON.parse(JSON.stringify(questions)));
    } catch (err: any) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdateSubject = (newSubjectName: string) => {
    if (!newSubjectName) return;

    const updatedQuestions = questions.map((q) => ({
      ...q,
      subject: newSubjectName,
    }));

    setQuestions(updatedQuestions);
  };

  const handleDeletePack = async () => {
    if (!questions.length) return;
    const confirmDelete = window.confirm(`Delete all ${questions.length} questions in this pack forever?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const ids = questions.map((q) => q._id);
      await axios.delete(`${API_URL}/bulk`, { data: { ids }, ...axiosConfig });
      alert('Pack deleted successfully.');
      setQuestions([]);
      setOriginalQuestions([]);
      fetchMetadata();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      <div className="flex min-h-screen">
          <div className="bg-white" style={{ border: "1px solid #E4E7EC" }} >
            <DashbaordComponent />
          </div>
    

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-6xl mx-auto space-y-6">
       
                <h1 className="text-3xl font-semibold text-slate-950">Questions</h1>
                <p className="text-sm text-slate-500">Manage and access all exam questions</p>

            <section className="rounded-[32px] border border-[#E4E7EC] bg-white p-6 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_280px] xl:grid-cols-[1.8fr_1fr_1fr_260px] items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Subject</label>
                  <select
                    className="h-12 rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={filters.subject}
                    onChange={(e) => setFilters({ subject: e.target.value, examType: '', examYear: '' })}
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Exam Type</label>
                  <select
                    className="h-12 rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={!filters.subject}
                    value={filters.examType}
                    onChange={(e) => setFilters({ ...filters, examType: e.target.value, examYear: '' })}
                  >
                    <option value="">All exams</option>
                    {availableExamTypes.map((examType) => (
                      <option key={examType} value={examType}>
                        {examType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Year</label>
                  <select
                    className="h-12 rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={!filters.examType}
                    value={filters.examYear}
                    onChange={(e) => setFilters({ ...filters, examYear: e.target.value })}
                  >
                    <option value="">All Years</option>
                    {availableYears
                      .slice()
                      .sort((a, b) => Number(b) - Number(a))
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={fetchQuestions}
                  disabled={loading}
                  className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Search Pack'}
                </button>
              </div>
            </section>

            <section className="rounded-[32px] border border-[#E4E7EC] bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Selected pack</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {filters.subject || 'No subject selected'}
                    {filters.examType ? ` • ${filters.examType}` : ''}
                    {filters.examYear ? ` • ${filters.examYear}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDeletePack}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Delete Pack
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={dirtyCount === 0 || loading}
                    className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Save {dirtyCount} Changes
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-[#E4E7EC] bg-[#F8FAFC] p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Status</p>
                    <p className="mt-2 text-base text-slate-700">{dirtyCount} unsaved change{dirtyCount === 1 ? '' : 's'}</p>
                  </div>

                  <div className="rounded-3xl border border-[#E4E7EC] bg-white p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Bulk update</p>
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="New subject name"
                        id="bulkSubjectInput"
                        className="flex-1 rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('bulkSubjectInput') as HTMLInputElement | null;
                          const val = input ? input.value : '';
                          handleBulkUpdateSubject(val);
                        }}
                        className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Rename
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#E4E7EC] bg-white p-4">
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
                        <JsonEditor
                          value={JSON.stringify(questions, null, 2)}
                          onChange={(value) => {
                            try {
                              const parsed = JSON.parse(value);
                              setQuestions(parsed);
                            } catch (e) {
                              // Silently handle invalid JSON while typing
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-[#F8FAFC] p-6 text-center text-slate-500">
                      Search for a subject, exam type, and year to load the question pack editor.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
