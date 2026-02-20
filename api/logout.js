import cookie from 'cookie'

export default function handler(req, res) {
  res.setHeader('Set-Cookie',
    cookie.serialize('sb-access-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(0)
    })
  )

  res.status(200).json({ message: 'Logged out' })
}