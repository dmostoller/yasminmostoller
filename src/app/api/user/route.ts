import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete all user's comments first due to foreign key constraints
    await prisma.comments.deleteMany({
      where: { users: { email: session.user.email } },
    });

    await prisma.post_comments.deleteMany({
      where: { users: { email: session.user.email } },
    });

    // Delete the user
    await prisma.users.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete account' + error }, { status: 500 });
  }
}
