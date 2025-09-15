<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  BarChart3,
  Coins,
  Activity,
  Save,
  X
} from 'lucide-react'
import Cookies from 'js-cookie'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, totalPixels: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', description: '', reward: '' })
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    const token = Cookies.get('admin_token')
    
    try {
      // Load users
      const usersResponse = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const usersData = await usersResponse.json()
      setUsers(usersData)

      // Load tasks
      const tasksResponse = await fetch('/api/admin/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const tasksData = await tasksResponse.json()
      setTasks(tasksData)

      // Calculate stats
      const totalPixels = usersData.reduce((sum, user) => sum + (user.balance || 0), 0)
      setStats({
        totalUsers: usersData.length,
        totalTasks: tasksData.length,
        totalPixels
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('admin_token')
    router.push('/admin')
  }

  const updateUserBalance = async (userId, newBalance) => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: userId, balance: parseInt(newBalance) })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error updating user balance:', error)
    }
  }

  const createTask = async () => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          reward: parseInt(newTask.reward)
        })
      })

      if (response.ok) {
        setNewTask({ title: '', description: '', reward: '' })
        setShowNewTaskForm(false)
        loadData()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTask = async (task) => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
      })

      if (response.ok) {
        setEditingTask(null)
        loadData()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: taskId })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Pixels</p>
                    <p className="text-2xl font-bold text-white">{stats.totalPixels}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">@{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          defaultValue={user.balance}
                          onBlur={(e) => updateUserBalance(user.id, e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400">Balance editable</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Task Management</h2>
              <button
                onClick={() => setShowNewTaskForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Create New Task</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Reward (pixels)"
                    value={newTask.reward}
                    onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={createTask}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create</span>
                  </button>
                  <button
                    onClick={() => setShowNewTaskForm(false)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-6">
                  {editingTask?.id === task.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                      />
                      <input
                        type="text"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                      />
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={editingTask.reward}
                          onChange={(e) => setEditingTask({ ...editingTask, reward: parseInt(e.target.value) })}
                          className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg"
                        />
                        <label className="flex items-center space-x-2 text-white">
                          <input
                            type="checkbox"
                            checked={editingTask.active}
                            onChange={(e) => setEditingTask({ ...editingTask, active: e.target.checked })}
                            className="rounded"
                          />
                          <span>Active</span>
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateTask(editingTask)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {task.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{task.reward} Pixels</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
=======
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  BarChart3,
  Coins,
  Activity,
  Save,
  X
} from 'lucide-react'
import Cookies from 'js-cookie'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, totalPixels: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', description: '', reward: '' })
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    const token = Cookies.get('admin_token')
    
    try {
      // Load users
      const usersResponse = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const usersData = await usersResponse.json()
      setUsers(usersData)

      // Load tasks
      const tasksResponse = await fetch('/api/admin/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const tasksData = await tasksResponse.json()
      setTasks(tasksData)

      // Calculate stats
      const totalPixels = usersData.reduce((sum, user) => sum + (user.balance || 0), 0)
      setStats({
        totalUsers: usersData.length,
        totalTasks: tasksData.length,
        totalPixels
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('admin_token')
    router.push('/admin')
  }

  const updateUserBalance = async (userId, newBalance) => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: userId, balance: parseInt(newBalance) })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error updating user balance:', error)
    }
  }

  const createTask = async () => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          reward: parseInt(newTask.reward)
        })
      })

      if (response.ok) {
        setNewTask({ title: '', description: '', reward: '' })
        setShowNewTaskForm(false)
        loadData()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTask = async (task) => {
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
      })

      if (response.ok) {
        setEditingTask(null)
        loadData()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    const token = Cookies.get('admin_token')
    
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: taskId })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Pixels</p>
                    <p className="text-2xl font-bold text-white">{stats.totalPixels}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">@{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          defaultValue={user.balance}
                          onBlur={(e) => updateUserBalance(user.id, e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400">Balance editable</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Task Management</h2>
              <button
                onClick={() => setShowNewTaskForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Create New Task</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Reward (pixels)"
                    value={newTask.reward}
                    onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={createTask}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create</span>
                  </button>
                  <button
                    onClick={() => setShowNewTaskForm(false)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-6">
                  {editingTask?.id === task.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                      />
                      <input
                        type="text"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                      />
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={editingTask.reward}
                          onChange={(e) => setEditingTask({ ...editingTask, reward: parseInt(e.target.value) })}
                          className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg"
                        />
                        <label className="flex items-center space-x-2 text-white">
                          <input
                            type="checkbox"
                            checked={editingTask.active}
                            onChange={(e) => setEditingTask({ ...editingTask, active: e.target.checked })}
                            className="rounded"
                          />
                          <span>Active</span>
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateTask(editingTask)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {task.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{task.reward} Pixels</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
>>>>>>> ab0bea77bf4ea80bfdb82b515bed3d52fb324687
