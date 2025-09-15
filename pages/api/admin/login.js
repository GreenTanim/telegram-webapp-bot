<<<<<<< HEAD
import { verifyAdminCredentials, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  if (verifyAdminCredentials(username, password)) {
    const token = generateToken({ username, role: 'admin' })
    res.status(200).json({ 
      success: true, 
      token,
      message: 'Login successful' 
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}
=======
import { verifyAdminCredentials, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  if (verifyAdminCredentials(username, password)) {
    const token = generateToken({ username, role: 'admin' })
    res.status(200).json({ 
      success: true, 
      token,
      message: 'Login successful' 
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}
>>>>>>> ab0bea77bf4ea80bfdb82b515bed3d52fb324687
