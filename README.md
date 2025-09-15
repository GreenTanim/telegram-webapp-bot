# Telegram Web App Bot

A modern Telegram web app bot with task management and pixel rewards system. Built with Next.js, Supabase, and deployed on Vercel.

## Features

- 🤖 Telegram Bot Integration
- 📱 Beautiful Web App Interface
- 💎 Pixel Reward System
- ✅ Task Management
- 👤 User Profile Management
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Bot**: Telegram Bot API

## Quick Setup Guide

### Step 1: Clone and Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### Step 2: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (you'll need it later)
5. Send `/setmenubutton` and set up the web app button

### Step 3: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API to get your URL and anon key
4. Go to SQL Editor and run this script to create tables:

```sql
-- Create users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reward INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_tasks table (to track completed tasks)
CREATE TABLE user_tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  task_id BIGINT REFERENCES tasks(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Insert sample tasks
INSERT INTO tasks (title, description, reward) VALUES
('Join our Telegram Channel', 'Join our official Telegram channel and stay updated', 100),
('Follow us on Twitter', 'Follow our Twitter account for the latest news', 150),
('Share with Friends', 'Share this bot with 3 friends', 200),
('Daily Check-in', 'Check in daily to earn bonus pixels', 50);
```

### Step 4: Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=your_vercel_app_url
```

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and create account
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy the application

### Step 6: Set up Telegram Webhook

After deployment, set up the webhook:

```bash
# Replace with your actual bot token and Vercel URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-vercel-app.vercel.app/api/telegram/webhook"}'
```

### Step 7: Configure Bot Menu Button

1. Message @BotFather in Telegram
2. Send `/setmenubutton`
3. Select your bot
4. Send your Vercel app URL
5. Set button text as "Open App"

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── lib/
│   └── supabase.js        # Supabase client
├── pages/api/             # API routes
│   ├── telegram/
│   │   └── webhook.js     # Telegram webhook
│   └── tasks/
│       └── index.js       # Tasks API
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## Usage

1. Users start the bot by sending `/start` in Telegram
2. Bot responds with a button to open the web app
3. Users can view their profile and balance
4. Users can complete available tasks to earn pixels
5. All data is stored in Supabase database

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if webhook is set correctly
2. **Database errors**: Verify Supabase credentials and table structure
3. **Web app not loading**: Check Vercel deployment and environment variables

### Support

If you encounter any issues, check:
- Vercel deployment logs
- Supabase logs
- Browser console for frontend errors

## License

MIT License - feel free to use this project for your own bots!
