import { NextRequest, NextResponse } from 'next/server';

// GET /api/users/active - Get only active users
export async function GET(request: NextRequest) {
  try {
    const activeUsers = [
      { id: 's1', name: 'Jamal Kamal', avgScore: 86, quizzesTaken: 24, status: 'Active' as const },
      { id: 's3', name: 'Chinedu Okeke', avgScore: 91, quizzesTaken: 40, status: 'Active' as const },
      { id: 's5', name: 'Peter Johnson', avgScore: 72, quizzesTaken: 8, status: 'Active' as const },
      { id: 's6', name: 'Grace Nwosu', avgScore: 88, quizzesTaken: 30, status: 'Active' as const },
      { id: 's8', name: 'Lydia Mensah', avgScore: 95, quizzesTaken: 48, status: 'Active' as const },
    ];

    return NextResponse.json(activeUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active users' }, { status: 500 });
  }
}
