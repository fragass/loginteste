import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password, username } = req.body

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) return res.status(400).json({ error: error.message })

  await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    username
  })

  res.status(200).json({ message: 'User created' })
}