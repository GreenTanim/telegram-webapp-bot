import { verifyAdminCredentials, generateToken } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  // Simple username/password check
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a simple session flag
    res.setHeader('Set-Cookie', 'admin_logged_in=true; Path=/; HttpOnly; Max-Age=86400')
    return res.status(200).json({ success: true, message: 'Login successful' })
  }

  return res.status(401).json({ error: 'Invalid credentials' })
}
