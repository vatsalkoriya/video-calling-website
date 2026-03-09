import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export interface AuthenticatedUser {
  userId: string;
  name: string;
  email: string;
}

export async function authenticate() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;

  return {
    user: {
      userId,
      name: user?.fullName ?? user?.username ?? 'User',
      email: primaryEmail ?? '',
    } satisfies AuthenticatedUser,
  };
}
