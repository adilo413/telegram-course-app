# Telegram Mini App - Secure Course Distribution

A comprehensive Telegram Mini App for secure course distribution with content protection, admin management, and channel-based access control.

## 🚀 Features

### Admin Features
- **Course Management**: Create, edit, delete, and manage courses
- **Rich Text Editor**: Full-featured editor with images, links, and formatting
- **Course Distribution**: Send courses to Telegram channels via bot
- **Access Control**: Manage admin users and channel members
- **Real-time Status**: Activate/deactivate courses instantly

### Student Features
- **Secure Access**: Channel membership verification required
- **Protected Content**: Copy/paste and right-click disabled
- **Watermarking**: User identification on course content
- **Mobile Optimized**: Perfect Telegram WebApp experience
- **Offline Support**: Works with localStorage for development

### Security Features
- **Content Protection**: Disabled copy, paste, right-click, and keyboard shortcuts
- **Image Protection**: Prevents image saving and dragging
- **Watermarking**: Subtle user identification overlay
- **Token-based Access**: Secure course links with validation
- **Channel Verification**: Membership-based access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Rich Text**: TipTap Editor
- **Storage**: localStorage (development), PostgreSQL (production ready)
- **Deployment**: Vercel optimized
- **Telegram**: WebApp SDK integration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   │   ├── courses/       # Course management
│   │   └── layout.tsx     # Admin layout
│   ├── api/               # API routes
│   │   ├── courses/       # Course CRUD operations
│   │   ├── bot/           # Telegram bot integration
│   │   ├── upload/        # Image upload handling
│   │   └── verify/        # User verification
│   ├── courses/           # Student course viewing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── CourseEditor.tsx   # Rich text editor
│   ├── ProtectedContent.tsx # Content protection wrapper
│   └── ...               # Other UI components
├── hooks/                 # Custom React hooks
│   ├── useTelegramWebApp.ts # Telegram integration
│   ├── useCourses.ts      # Course management
│   └── ...               # Other hooks
├── lib/                   # Utility libraries
│   └── storage.ts         # Data storage management
└── types/                 # TypeScript definitions
    └── telegram.d.ts      # Telegram WebApp types
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Telegram Bot Token (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telegram-course-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_BOT_USERNAME=your_bot_username
   CHANNEL_CHAT_ID=-1001234567890
   CHANNEL_INVITE_LINK=https://t.me/+ABC123...
   BOT_TOKEN=your_telegram_bot_token
   JWT_SECRET=your_jwt_secret_key
   ADMIN_USER_IDS=123456789
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Telegram Bot Setup

### 1. Create a Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command
3. Follow instructions to create your bot
4. Save the bot token

### 2. Create a Private Channel
1. Create a new private channel in Telegram
2. Add your bot as an administrator
3. Get the channel invite link (e.g., `https://t.me/+ABC123...`)
4. Note the channel chat ID (e.g., `-1001234567890`)

### 3. Configure Mini App
1. Message [@BotFather](https://t.me/botfather)
2. Use `/newapp` command
3. Select your bot
4. Set the Mini App URL to your deployed Vercel URL
5. Upload app icons and set description

## 🚀 Deployment to Vercel

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Environment Variables in Vercel
Set these in your Vercel project settings:
- `NEXT_PUBLIC_SITE_URL`: Your Vercel app URL
- `NEXT_PUBLIC_BOT_USERNAME`: Your bot username
- `CHANNEL_CHAT_ID`: Your private channel chat ID (e.g., -1001234567890)
- `CHANNEL_INVITE_LINK`: Your private channel invite link
- `BOT_TOKEN`: Your bot token
- `JWT_SECRET`: Random secret key
- `ADMIN_USER_IDS`: Comma-separated list of admin user IDs

### 3. Update Bot Mini App URL
1. Go to [@BotFather](https://t.me/botfather)
2. Use `/editapp` command
3. Select your bot
4. Update the Mini App URL to your Vercel URL

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Key Features Implementation

#### Content Protection
The `ProtectedContent` component implements multiple layers of protection:
- Disables context menu (right-click)
- Prevents keyboard shortcuts (Ctrl+C, Ctrl+A, etc.)
- Disables text selection
- Prevents image dragging
- Adds watermark overlay

#### Course Management
- Rich text editor with TipTap
- Image upload support
- Course status management
- Token-based access control

#### Telegram Integration
- WebApp SDK integration
- Haptic feedback
- Main/Back button handling
- User authentication

## 🔒 Security Considerations

### Content Protection Limitations
- Screenshots cannot be completely prevented
- Advanced users may bypass some restrictions
- Watermarking provides user identification
- Server-side validation is essential

### Best Practices
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Regular security audits
- Monitor access logs

## 🗄️ Database Migration

The app currently uses localStorage for development. To migrate to a real database:

1. **Set up PostgreSQL/Supabase**
2. **Update storage.ts** to use database queries
3. **Add database connection** in API routes
4. **Update environment variables**

Example database schema:
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  token TEXT UNIQUE NOT NULL,
  author_id TEXT,
  author_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE channel_members (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 Bot Integration

### Sending Courses to Channel
The bot integration allows admins to send courses directly to the private channel:

```typescript
// Example bot message
const message = {
  text: `📚 New Course Available!\n\n**${course.title}**`,
  reply_markup: {
    inline_keyboard: [[
      {
        text: "📖 View Course",
        web_app: { url: courseUrl }
      }
    ]]
  }
};
```

### Deep Link Handling
Students can access courses via deep links:
```
https://your-app.vercel.app/courses/course-id?token=access-token
```

## 📊 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and monitoring
- **Google Analytics**: User behavior tracking
- **Custom Logging**: Course access and user activity

## 🆘 Troubleshooting

### Common Issues

1. **Telegram WebApp not loading**
   - Check if the app is deployed and accessible
   - Verify Mini App URL in BotFather
   - Ensure HTTPS is enabled

2. **Content protection not working**
   - Check browser console for errors
   - Verify ProtectedContent component is wrapping content
   - Test on different devices/browsers

3. **Course access denied**
   - Verify user is added to channel members
   - Check course token validity
   - Ensure course is active

4. **Image upload issues**
   - Check file size limits
   - Verify image format support
   - Test with different images

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the Telegram Bot API documentation

---

**Built with ❤️ for secure course distribution via Telegram**
