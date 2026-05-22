import { getAuthHeaders } from '@/lib/apiClient';

export type TotalUsersResponse = {
  totalUsers: number;
};

export type ActiveUsersResponse = {
  activeUsers: number;
};

export type TotalPracticeTestsResponse = {
  totalPracticeTests: number;
};

export type PracticeTestsByModeResponse = {
  totalPracticeTests: number;
};

export type PracticeTestsByExamResponse = {
  total: number;
};

const BASE_URL = "https://past-questions-api.onrender.com/api/analytics";

async function handleFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}/${path}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTotalUsers(): Promise<TotalUsersResponse> {
  return handleFetch<TotalUsersResponse>("total-users");
}

export async function getActiveUsers(): Promise<ActiveUsersResponse> {
  return handleFetch<ActiveUsersResponse>("active-users");
}

export async function getTotalPracticeTests(): Promise<TotalPracticeTestsResponse> {
  return handleFetch<TotalPracticeTestsResponse>("total-practice-tests");
}

export async function getPracticeTestsByMode(
  mode?: string
): Promise<PracticeTestsByModeResponse> {
  const query = mode ? `?mode=${encodeURIComponent(mode)}` : "";
  return handleFetch<PracticeTestsByModeResponse>(`practice-tests-by-mode${query}`);
}

export async function getPracticeTestsByExam(
  exam?: string
): Promise<PracticeTestsByExamResponse> {
  const query = exam ? `?exam=${encodeURIComponent(exam)}` : "";
  return handleFetch<PracticeTestsByExamResponse>(`practice-tests-by-exam${query}`);
}
