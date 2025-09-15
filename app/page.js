'use client'

import { useEffect, useState } from 'react'
import { User, Coins, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(100)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      
      // Get user data from Telegram
      const telegramUser = tg.initDataUnsafe?.user
      if (telegramUser) {
        setUser(telegramUser)
        initializeUser(telegramUser)
      }
    }
    
    loadTasks()
  }, [])

  const initializeUser = async (telegramUser) => {
    try {
      // Check if user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single()

      if (!existingUser) {
        // Create new user with 100 pixels default balance
        const { data: newUser } = await supabase
          .from('users')
          .insert([
            {
              telegram_id: telegramUser.id,
              username: telegramUser.username,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              balance: 100
            }
          ])
          .select()
          .single()
        
        setBalance(100)
      } else {
        setBalance(existingUser.balance)
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
      
      setTasks(tasksData || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const completeTask = async (taskId, reward) => {
    if (!user) return

    try {
      // Mark task as completed for user
      await supabase
        .from('user_tasks')
        .insert([
          {
            user_id: user.id,
            task_id: taskId,
            completed: true
          }
        ])

      // Update user balance
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ balance: balance + reward })
        .eq('telegram_id', user.id)
        .select()
        .single()

      setBalance(updatedUser.balance)
      
      // Show success message
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`Task completed! You earned ${reward} Pixels!`)
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  // Get user profile photo URL
  const getProfilePhotoUrl = (user) => {
    if (user?.photo_url) {
      return user.photo_url
    }
    // Fallback to Telegram API for profile photo
    return `https://t.me/i/userpic/320/${user?.username || 'default'}.jpg`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
        {/* User Info with Profile Picture - Top Left */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user ? (
              <img
                src={getProfilePhotoUrl(user)}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white/30"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className="bg-white/20 p-2 rounded-full w-12 h-12 flex items-center justify-center" style={{display: user ? 'none' : 'flex'}}>
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-white">
            <div className="font-semibold">
              {user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Guest'}
            </div>
            <div className="text-sm opacity-80">
              @{user?.username || 'unknown'}
            </div>
          </div>
        </div>

        {/* Balance - Top Right */}
        <div className="flex items-center space-x-2 bg-yellow-400/20 px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-bold">Balance: {balance} Pixels</span>
        </div>
      </div>

      {/* Available Tasks Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2" />
          Available Tasks
        </h2>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No tasks available at the moment</p>
            <p className="text-white/50 text-sm">Check back later for new tasks!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                  <div className="flex items-center space-x-1 bg-yellow-400/20 px-2 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-300" />
                    <span className="text-yellow-300 font-bold text-sm">+{task.reward}</span>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4">{task.description}</p>
                
                <button
                  onClick={() => completeTask(task.id, task.reward)}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition-colors"
                >
                  Complete Task
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Complete tasks to earn Pixels and climb the leaderboard!
        </p>
      </div>
    </div>
  )
}
