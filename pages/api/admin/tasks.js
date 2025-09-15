import { requireAuth } from '../../../lib/auth'
import { supabase } from '../../../lib/supabase'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      res.status(200).json(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      res.status(500).json({ error: 'Failed to fetch tasks' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, reward } = req.body

      const { data: task, error } = await supabase
        .from('tasks')
        .insert([
          {
            title,
            description,
            reward,
            active: true
          }
        ])
        .select()
        .single()

      if (error) throw error

      res.status(201).json(task)
    } catch (error) {
      console.error('Error creating task:', error)
      res.status(500).json({ error: 'Failed to create task' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, reward, active } = req.body

      const { data: task, error } = await supabase
        .from('tasks')
        .update({ title, description, reward, active })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      res.status(200).json(task)
    } catch (error) {
      console.error('Error updating task:', error)
      res.status(500).json({ error: 'Failed to update task' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting task:', error)
      res.status(500).json({ error: 'Failed to delete task' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default requireAuth(handler)
