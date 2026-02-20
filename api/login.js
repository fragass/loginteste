const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

if (error) return res.status(401).json({ error: 'Invalid credentials' })

const access_token = data.session.access_token

res.setHeader('Set-Cookie',
  cookie.serialize('sb-access-token', access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60
  })
)

res.status(200).json({ message: 'Logged in' })
