import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('active', true)
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
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
