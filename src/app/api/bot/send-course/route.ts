import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/storage';
import { sendCourseToChannel, generateCourseUrl } from '@/lib/bot';

// POST /api/bot/send-course - Send course to Telegram channel
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { courseId, channelId } = data;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get course
    const course = getCourseById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (!course.isActive) {
      return NextResponse.json(
        { error: 'Course is not active' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Use the Telegram Bot API to send a message to the channel
    // 2. Include an inline keyboard with a "View Course" button
    // 3. The button would link to the mini app with the course token

    const courseUrl = generateCourseUrl(
      course.id, 
      course.token, 
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    );
    
    // Send course to Telegram channel
    const botToken = process.env.BOT_TOKEN;
    const targetChannelId = channelId || process.env.CHANNEL_CHAT_ID;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }
    
    if (!targetChannelId) {
      return NextResponse.json(
        { error: 'Channel ID not configured' },
        { status: 500 }
      );
    }

    const result = await sendCourseToChannel(
      {
        courseId: course.id,
        courseTitle: course.title,
        courseUrl,
        channelId: targetChannelId,
      },
      botToken,
      targetChannelId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send course to channel' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course sent to channel successfully',
      courseUrl,
      messageId: result.messageId,
    });

  } catch (error) {
    console.error('Error sending course to channel:', error);
    return NextResponse.json(
      { error: 'Failed to send course to channel' },
      { status: 500 }
    );
  }
}
