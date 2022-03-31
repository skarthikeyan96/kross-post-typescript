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
    const DEV_API_KEY = req.headers['api-key'] as string
    const API_URL = 'https://dev.to/api/articles'

    const response = await axios({
      url: API_URL,
      method: 'post',
      headers: { 'api-key': DEV_API_KEY },
      data: req.body,
    })

    res.status(200).json({ data: response.data.canonical_url })
  } catch (error) {
    res.status(500).json({ data: error })
  }
}
