# Deployment Guide - Telegram Mini App

This guide will help you deploy the Telegram Mini App to Vercel and set up the Telegram bot integration.

## 🚀 Quick Deployment to Vercel

### 1. Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Telegram Mini App"
   git push origin main
   ```

2. **Ensure all files are committed**
   - `package.json`
   - `next.config.js`
   - `vercel.json`
   - `src/` directory
   - `tailwind.config.js`
   - `tsconfig.json`

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? telegram-course-app
# - Directory? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Click "Deploy"

### 3. Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
CHANNEL_CHAT_ID=-1001234567890
CHANNEL_INVITE_LINK=https://t.me/+ABC123...
BOT_TOKEN=your_telegram_bot_token
JWT_SECRET=your_random_secret_key_here
ADMIN_USER_IDS=123456789
```

**Important Notes:**
- Replace `your-app-name` with your actual Vercel app name
- Use a strong, random JWT_SECRET (32+ characters)
- Keep BOT_TOKEN secure and never commit it to git

### 4. Redeploy After Setting Environment Variables

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## 🤖 Telegram Bot Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the instructions:
   - Choose a name for your bot
   - Choose a username (must end with 'bot')
4. Save the **Bot Token** (you'll need this for environment variables)

### 2. Create a Private Channel

1. In Telegram, create a new channel
2. Make it **Private**
3. Add your bot as an **Administrator**
4. Get the channel invite link (e.g., `https://t.me/+ABC123...`)
5. Note the channel chat ID (e.g., `-1001234567890`)

### 3. Configure Mini App

1. Go back to [@BotFather](https://t.me/botfather)
2. Send `/newapp`
3. Select your bot
4. Follow the setup:
   - **App Title**: Secure Course Platform
   - **App Description**: A secure platform for distributing courses
   - **App Photo**: Upload an icon (512x512px recommended)
   - **App Short Description**: Secure course distribution
   - **Web App URL**: `https://your-app-name.vercel.app`
   - **App Photo**: Upload a larger icon (1024x1024px recommended)

### 4. Test the Mini App

1. Go to your bot in Telegram
2. Send `/start`
3. You should see a "Launch App" button
4. Click it to open your Mini App

## 🔧 Configuration

### 1. Update Bot Commands (Optional)

Send these commands to [@BotFather](https://t.me/botfather):

```
/setcommands
@your_bot_username
start - Start the app
help - Get help
```

### 2. Set Bot Description (Optional)

```
/setdescription
@your_bot_username
Secure course distribution platform. Access your courses through this bot.
```

### 3. Configure Channel Permissions

In your private channel:
1. Go to channel settings
2. Add your bot as administrator
3. Give it these permissions:
   - Post messages
   - Edit messages
   - Delete messages

## 🧪 Testing

### 1. Test Admin Access

1. Open your Mini App
2. You should be redirected to the admin panel
3. Try creating a new course
4. Test the rich text editor
5. Verify course creation works

### 2. Test Student Access

1. Add a test user to your channel members list
2. Create a course and send it to the channel
3. Test accessing the course as a student
4. Verify content protection is working

### 3. Test Content Protection

1. Open a course as a student
2. Try right-clicking (should be disabled)
3. Try copying text (should be disabled)
4. Check for watermark overlay

## 🔍 Troubleshooting

### Common Issues

#### 1. Mini App Not Loading
- **Check**: Vercel deployment is successful
- **Check**: Environment variables are set correctly
- **Check**: Bot Mini App URL is correct in BotFather

#### 2. "Access Denied" Errors
- **Check**: User is added to channel members
- **Check**: Course is active
- **Check**: Token is valid

#### 3. Content Protection Not Working
- **Check**: ProtectedContent component is wrapping content
- **Check**: Browser console for JavaScript errors
- **Check**: Test on different devices

#### 4. Bot Not Sending Messages
- **Check**: Bot token is correct
- **Check**: Bot is admin in the channel
- **Check**: Channel ID is correct

### Debug Mode

Add this to your environment variables for debugging:
```env
NODE_ENV=development
DEBUG=true
```

## 📊 Monitoring

### 1. Vercel Analytics
- Built-in performance monitoring
- View in Vercel dashboard under "Analytics"

### 2. Error Tracking
Consider adding:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Google Analytics**: For user behavior

### 3. Custom Logging
Add logging to track:
- Course access attempts
- User authentication
- Bot interactions

## 🔄 Updates and Maintenance

### 1. Updating the App
```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel will automatically redeploy
```

### 2. Environment Variable Updates
1. Update in Vercel dashboard
2. Redeploy manually or wait for next push

### 3. Bot Updates
- Update Mini App URL in BotFather if domain changes
- Update bot commands if needed
- Update channel permissions if needed

## 🚨 Security Checklist

- [ ] Environment variables are set securely
- [ ] Bot token is not exposed in code
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Content protection is working
- [ ] User access is properly validated
- [ ] Channel membership is verified

## 📞 Support

If you encounter issues:

1. **Check the logs** in Vercel dashboard
2. **Test locally** with `npm run dev`
3. **Verify environment variables** are set correctly
4. **Check Telegram Bot API** documentation
5. **Review the troubleshooting section** above

## 🎉 Success!

Once deployed successfully, you should have:

- ✅ A working Telegram Mini App
- ✅ Admin panel for course management
- ✅ Secure student course viewing
- ✅ Content protection features
- ✅ Bot integration for course distribution

Your app is now ready for production use!
