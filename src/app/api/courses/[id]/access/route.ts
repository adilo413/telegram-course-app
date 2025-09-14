import { NextResponse } from 'next/server';
import { getCourseByToken, isChannelMember } from '@/lib/storage';
import { verifyChannelMembership } from '@/lib/bot';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/courses/[id]/access - Check course access
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get course by token
    const course = getCourseByToken(token);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or inactive' },
        { status: 404 }
      );
    }

    // Verify course ID matches
    if (course.id !== params.id) {
      return NextResponse.json(
        { error: 'Invalid course access' },
        { status: 403 }
      );
    }

    // Check if user is a channel member using Telegram Bot API
    const botToken = process.env.BOT_TOKEN;
    const channelId = process.env.CHANNEL_CHAT_ID;
    
    if (botToken && channelId) {
      const membershipResult = await verifyChannelMembership(userId, channelId, botToken);
      if (!membershipResult.isMember) {
        return NextResponse.json(
          { error: 'Channel membership required', inviteLink: process.env.CHANNEL_INVITE_LINK },
          { status: 403 }
        );
      }
    } else {
      // Fallback to localStorage check for development
      const isMember = isChannelMember(userId);
      if (!isMember) {
        return NextResponse.json(
          { error: 'Channel membership required' },
          { status: 403 }
        );
      }
    }

    // Return course data
    return NextResponse.json({
      course,
      access: true,
      message: 'Access granted'
    });

  } catch (error) {
    console.error('Error checking course access:', error);
    return NextResponse.json(
      { error: 'Failed to check course access' },
      { status: 500 }
    );
  }
}
