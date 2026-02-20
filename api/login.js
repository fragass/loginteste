import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign(
    { user_id: data.user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // salvar log
  await createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ).from('login_logs').insert({
    user_id: data.user.id,
    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    user_agent: req.headers['user-agent']
  })

  res.setHeader('Set-Cookie',
    cookie.serialize('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60
    })
  )

  res.status(200).json({ message: 'Logged in' })
}