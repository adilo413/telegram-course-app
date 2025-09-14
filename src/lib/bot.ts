// Telegram Bot Integration
// This file contains utilities for integrating with the Telegram Bot API

export interface BotMessage {
  text: string;
  reply_markup?: {
    inline_keyboard: Array<Array<{
      text: string;
      web_app?: {
        url: string;
      };
      url?: string;
    }>>;
  };
  parse_mode?: 'Markdown' | 'HTML';
}

export interface CourseMessage {
  courseId: string;
  courseTitle: string;
  courseUrl: string;
  channelId?: string;
}

/**
 * Generate a bot message for course distribution
 */
export function generateCourseMessage({ courseId, courseTitle, courseUrl }: CourseMessage): BotMessage {
  return {
    text: `📚 **New Course Available!**\n\n**${courseTitle}**\n\nClick the button below to access the course securely.`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📖 View Course",
            web_app: {
              url: courseUrl
            }
          }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };
}

/**
 * Send course to Telegram channel
 * In production, this would make an actual API call to Telegram
 */
export async function sendCourseToChannel(
  courseMessage: CourseMessage,
  botToken: string,
  channelId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = generateCourseMessage(courseMessage);
    
    // Use the actual Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message.text,
        reply_markup: message.reply_markup,
        parse_mode: message.parse_mode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to send message');
    }

    const data = await response.json();
    return { success: true, messageId: data.result.message_id };
    
  } catch (error) {
    console.error('Error sending course to channel:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Verify user membership in a channel
 * In production, this would check actual Telegram channel membership
 */
export async function verifyChannelMembership(
  userId: string,
  channelId: string,
  botToken: string
): Promise<{ isMember: boolean; error?: string }> {
  try {
    // Use the actual Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to check membership');
    }

    const data = await response.json();
    const status = data.result.status;
    const isMember = ['member', 'administrator', 'creator'].includes(status);
    
    return { isMember };
    
  } catch (error) {
    console.error('Error verifying channel membership:', error);
    return { 
      isMember: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate a secure course URL
 */
export function generateCourseUrl(courseId: string, token: string, baseUrl: string): string {
  return `${baseUrl}/courses/${courseId}?token=${token}`;
}

/**
 * Validate Telegram WebApp init data
 * This is a simplified version - in production, you should properly validate the hash
 */
export function validateTelegramWebAppData(initData: string, botToken: string): boolean {
  try {
    // In production, you should:
    // 1. Parse the init data
    // 2. Extract the hash
    // 3. Validate the hash using HMAC-SHA256
    // 4. Check the auth_date is not too old
    
    // For development, just check if initData exists
    return typeof initData === 'string' && initData.length > 0;
  } catch (error) {
    console.error('Error validating Telegram WebApp data:', error);
    return false;
  }
}
