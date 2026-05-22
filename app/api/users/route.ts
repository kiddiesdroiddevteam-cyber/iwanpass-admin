import { NextRequest, NextResponse } from 'next/server';

// Sample data - in production, this would come from a database
const users = [
  { id: 's1', name: 'Jamal Kamal', avgScore: 86, quizzesTaken: 24, status: 'Active' as const },
  { id: 's2', name: 'Amaka Oladipo', avgScore: 78, quizzesTaken: 12, status: 'Inactive' as const },
  { id: 's3', name: 'Chinedu Okeke', avgScore: 91, quizzesTaken: 40, status: 'Active' as const },
  { id: 's4', name: 'Aisha Bello', avgScore: 64, quizzesTaken: 5, status: 'Inactive' as const },
  { id: 's5', name: 'Peter Johnson', avgScore: 72, quizzesTaken: 8, status: 'Active' as const },
  { id: 's6', name: 'Grace Nwosu', avgScore: 88, quizzesTaken: 30, status: 'Active' as const },
  { id: 's7', name: 'Sam Adeyemi', avgScore: 55, quizzesTaken: 3, status: 'Inactive' as const },
  { id: 's8', name: 'Lydia Mensah', avgScore: 95, quizzesTaken: 48, status: 'Active' as const },
];

// GET /api/users/ - Get all users
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
