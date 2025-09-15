import { supabase } from '../../../lib/supabase'

function isAdminAuthenticated(req) {
  const cookies = req.headers.cookie || ''
  return cookies.includes('admin_logged_in=true')
}

export default async function handler(req, res) {
  // Check authentication
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'POST') {
    const { title, description, reward } = req.body

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{ title, description, reward, active: true }])

      if (error) throw error
      return res.status(201).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'PUT') {
    const { id, title, description, reward, active } = req.body

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ title, description, reward, active })
        .eq('id', id)

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
