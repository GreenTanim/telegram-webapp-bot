import TelegramBot from 'node-telegram-bot-api'
import { supabase } from '../../../lib/supabase'

const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, callback_query } = req.body

      if (message) {
        const chatId = message.chat.id
        const userId = message.from.id
        const text = message.text

        if (text === '/start') {
          // Initialize user in database
          await initializeUser(message.from)
          
          // Send welcome message with web app button
          const webAppUrl = process.env.TELEGRAM_WEBHOOK_URL || 'https://your-vercel-app.vercel.app'
          
          await bot.sendMessage(chatId, 
            `🎉 Welcome to Pixel Tasks Bot!\n\n` +
            `Complete tasks and earn Pixels! 💎\n\n` +
            `Click the button below to open the web app:`, 
            {
              reply_markup: {
                inline_keyboard: [[
                  {
                    text: '🚀 Open Web App',
                    web_app: { url: webAppUrl }
                  }
                ]]
              }
            }
          )
        }
      }

      res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

async function initializeUser(telegramUser) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single()

    if (!existingUser) {
      await supabase
        .from('users')
        .insert([
          {
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            balance: 0
          }
        ])
    }
  } catch (error) {
    console.error('Error initializing user:', error)
  }
}
