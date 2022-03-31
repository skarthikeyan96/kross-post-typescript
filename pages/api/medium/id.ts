import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const MEDIUM_API_KEY = req.headers['authorization'] as string
    const MEDIUM_USER_ENDPOINT = `https://api.medium.com/v1/me`

    const response = await axios({
      method: 'GET',
      headers: {
        Authorization: MEDIUM_API_KEY,
      },
      url: MEDIUM_USER_ENDPOINT,
    })

    const { id } = response.data.data
    res.status(200).json({ data: id })
  } catch (error) {
    res.status(500).json({ data: error })
  }
}
