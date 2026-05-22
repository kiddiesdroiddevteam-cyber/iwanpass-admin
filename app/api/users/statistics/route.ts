import { NextRequest, NextResponse } from 'next/server';

// GET /api/users/statistics - Get user statistics summary
export async function GET(request: NextRequest) {
  try {
    const statistics = {
      totalUsers: 8,
      activeUsers: 5,
      inactiveUsers: 3,
      averageScore: 78.6,
      totalQuizzesTaken: 170,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
