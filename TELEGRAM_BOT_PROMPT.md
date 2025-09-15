# Complete A-Z Telegram Web App Bot Building Prompt

## 🎯 Project Overview
I want to create a complete Telegram web app bot with task management and pixel rewards system. The bot should have a beautiful web interface, secure admin panel, and be deployed on free hosting platforms.

## 📱 Frontend Requirements

### Main Web App Interface:
- **Top Left**: User's Telegram profile picture and name/username
- **Top Right**: Balance display showing "Balance: 100 Pixels" format
- **Main Section**: Available tasks list with descriptions and pixel rewards
- **Design**: Modern gradient background (blue to purple), glassmorphism UI
- **Responsive**: Works perfectly on mobile devices
- **Interactive**: Smooth animations and hover effects

### User Experience:
- Users start with 100 pixels default balance
- Profile pictures load from Telegram automatically
- Task completion shows success messages
- Real-time balance updates
- Beautiful loading states

## 🔐 Admin Panel Requirements

### Admin Authentication:
- Secure login page with username/password
- JWT-based authentication with 24-hour tokens
- Password hashing with bcrypt
- Protected routes and API endpoints
- Auto-logout on token expiration

### Admin Dashboard Features:
- **Overview Tab**: Statistics (total users, tasks, pixels distributed)
- **Users Tab**: View all users, edit balances, see join dates
- **Tasks Tab**: Full CRUD operations (Create, Read, Update, Delete)
- **Task Management**: Toggle active/inactive, set rewards, edit descriptions
- **Real-time Updates**: Changes reflect immediately

## 🗄️ Database Requirements

### Supabase Tables:
```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reward INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tasks tracking
CREATE TABLE user_tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  task_id BIGINT REFERENCES tasks(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Sample tasks
INSERT INTO tasks (title, description, reward) VALUES
('Join our Telegram Channel', 'Join our official channel for updates', 100),
('Follow us on Twitter', 'Follow our Twitter for news', 150),
('Share with Friends', 'Share this bot with 3 friends', 200),
('Daily Check-in', 'Check in daily for bonus pixels', 50);
```

## 🤖 Telegram Bot Features

### Bot Commands:
- `/start` - Welcome message with web app button
- Automatic user registration in database
- Profile photo integration
- Web app button in bot menu

### Bot Setup:
- Create bot via @BotFather
- Set web app menu button
- Configure webhook for message handling
- Handle user initialization

## 🚀 Tech Stack Requirements

### Frontend:
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **State Management**: React hooks
- **Authentication**: JWT tokens with js-cookie

### Backend:
- **API**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: bcryptjs + jsonwebtoken
- **Bot API**: node-telegram-bot-api

### Deployment:
- **Hosting**: Vercel (free tier)
- **Database**: Supabase (free tier)
- **Repository**: GitHub
- **Domain**: Free Vercel subdomain

## 🔧 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=your_vercel_app_url

# Admin Panel Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SecureAdmin123!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 📁 Project Structure

```
telegram-webapp-bot/
├── app/
│   ├── admin/
│   │   ├── page.js              # Admin login page
│   │   └── dashboard/
│   │       └── page.js          # Admin dashboard
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Main web app
├── lib/
│   ├── auth.js                  # Authentication utilities
│   └── supabase.js              # Database client
├── pages/api/
│   ├── admin/
│   │   ├── login.js             # Admin login API
│   │   ├── users.js             # User management API
│   │   └── tasks.js             # Task management API
│   ├── tasks/
│   │   └── index.js             # Public tasks API
│   └── telegram/
│       └── webhook.js           # Telegram webhook
├── .env.local                   # Environment variables (local)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
└── vercel.json                  # Vercel deployment config
```

## 🎨 Design Requirements

### Color Scheme:
- **Primary Gradient**: Blue (#667eea) to Purple (#764ba2)
- **Accent**: Yellow (#fbbf24) for pixels/rewards
- **Text**: White with various opacity levels
- **Backgrounds**: Glassmorphism with backdrop-blur

### UI Components:
- Rounded corners and smooth shadows
- Hover effects and transitions
- Loading states and error handling
- Responsive design for all screen sizes
- Modern typography and spacing

## 🔒 Security Features

### Admin Panel Security:
- Password hashing with salt
- JWT tokens with expiration
- Protected API routes
- Input validation and sanitization
- Environment variable protection

### General Security:
- `.env.local` never committed to Git
- Secure headers in Next.js config
- CORS protection
- Rate limiting considerations

## 📋 Step-by-Step Implementation

### Phase 1: Setup (30 minutes)
1. Create Next.js project with Tailwind CSS
2. Set up Supabase database and tables
3. Create Telegram bot via @BotFather
4. Configure environment variables

### Phase 2: Core Web App (45 minutes)
1. Build main page with profile display
2. Implement task loading and completion
3. Add balance management
4. Style with gradients and glassmorphism

### Phase 3: Admin Panel (60 minutes)
1. Create authentication system
2. Build admin login page
3. Develop dashboard with tabs
4. Implement CRUD operations for tasks and users

### Phase 4: Telegram Integration (30 minutes)
1. Set up webhook endpoint
2. Handle /start command
3. Configure web app button
4. Test user flow

### Phase 5: Deployment (30 minutes)
1. Push code to GitHub
2. Deploy to Vercel
3. Configure environment variables
4. Set up Telegram webhook
5. Test complete system

## 🧪 Testing Checklist

### Web App Testing:
- [ ] Profile picture displays correctly
- [ ] Balance shows "Balance: X Pixels" format
- [ ] Tasks load and display properly
- [ ] Task completion works and updates balance
- [ ] Responsive design on mobile
- [ ] Loading states work properly

### Admin Panel Testing:
- [ ] Login with correct credentials works
- [ ] Protected routes redirect to login
- [ ] User management functions work
- [ ] Task CRUD operations work
- [ ] Statistics display correctly
- [ ] Logout functionality works

### Telegram Bot Testing:
- [ ] /start command shows web app button
- [ ] Web app opens correctly from Telegram
- [ ] User data syncs with database
- [ ] Profile photos load in web app

## 🎯 Success Criteria

### User Experience:
- ✅ Beautiful, modern interface
- ✅ Smooth user onboarding
- ✅ Intuitive task completion
- ✅ Real-time balance updates
- ✅ Mobile-responsive design

### Admin Experience:
- ✅ Secure authentication
- ✅ Complete user management
- ✅ Easy task creation/editing
- ✅ Clear statistics dashboard
- ✅ Professional interface

### Technical:
- ✅ Free hosting (Vercel + Supabase)
- ✅ Scalable architecture
- ✅ Secure implementation
- ✅ Clean, maintainable code
- ✅ Proper error handling

## 🚀 Deployment URLs

After completion, you'll have:
- **Web App**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **Telegram Bot**: `@YourBotName`

## 💡 Additional Features (Optional)

### Enhanced Features:
- Leaderboard system
- Task categories
- Daily login bonuses
- Referral system
- Push notifications
- Multi-language support
- Dark/light theme toggle
- Export user data
- Analytics dashboard
- Bulk user operations

This prompt provides everything needed to build a complete, professional Telegram web app bot with admin panel from scratch!
