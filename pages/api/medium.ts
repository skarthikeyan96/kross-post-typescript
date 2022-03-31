// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const MEDIUM_API_KEY = req.headers['authorization'] as string
    const id = req.query.id

    const MEDIUM_API_URL = `https://api.medium.com/v1/users/${id}/posts`

    const createPostResponse = await axios({
      url: MEDIUM_API_URL,
      method: 'post',
      headers: {
        Authorization: MEDIUM_API_KEY,
      },
      data: req.body,
    })
    res.status(200).json({ data: createPostResponse.data })
  } catch (error: any) {
    res.status(500).json({ data: error.message })
  }
}
