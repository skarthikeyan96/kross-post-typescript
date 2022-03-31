import { handleLogin } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await handleLogin(req, res, {
      authorizationParams: {
        // Note that this can be combined with prompt=login , which indicates if
        // you want to always show the authentication page or you want to skip
        // if there’s an existing session.
        screen_hint: 'signup',
      },
    })
  } catch (error: any) {
    res.status(error.status || 400).end(error.message)
  }
}
