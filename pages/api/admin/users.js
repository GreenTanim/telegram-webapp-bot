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
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'PUT') {
    const { id, balance } = req.body

    try {
      const { error } = await supabase
        .from('users')
        .update({ balance })
        .eq('id', id)

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
