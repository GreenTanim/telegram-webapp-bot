import { requireAuth } from '../../../lib/auth'
import { supabase } from '../../../lib/supabase'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      res.status(200).json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, balance } = req.body

      const { data: user, error } = await supabase
        .from('users')
        .update({ balance })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      res.status(200).json(user)
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default requireAuth(handler)
