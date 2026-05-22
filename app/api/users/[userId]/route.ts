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

// GET /api/users/:userId - Get specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// DELETE /api/users/:userId - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(userIndex, 1);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
