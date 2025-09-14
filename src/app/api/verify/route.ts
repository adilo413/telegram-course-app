import { NextResponse } from 'next/server';
import { isAdminUser, isChannelMember, addChannelMember, addAdminUser } from '@/lib/storage';

// POST /api/verify - Verify user permissions
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, username, firstName, lastName, type } = data;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userInfo = {
      userId: userId.toString(),
      username,
      firstName,
      lastName,
    };

    let result = {
      isAdmin: false,
      isChannelMember: false,
      user: userInfo,
    };

    // Check admin status
    result.isAdmin = isAdminUser(userId.toString());

    // Check channel membership
    result.isChannelMember = isChannelMember(userId.toString());

    // If type is specified, add user to appropriate list
    if (type === 'admin' && !result.isAdmin) {
      addAdminUser(userInfo);
      result.isAdmin = true;
    } else if (type === 'member' && !result.isChannelMember) {
      addChannelMember(userInfo);
      result.isChannelMember = true;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { error: 'Failed to verify user' },
      { status: 500 }
    );
  }
}

// GET /api/verify - Get user verification status
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = {
      isAdmin: isAdminUser(userId),
      isChannelMember: isChannelMember(userId),
      userId,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error getting user verification:', error);
    return NextResponse.json(
      { error: 'Failed to get user verification' },
      { status: 500 }
    );
  }
}
