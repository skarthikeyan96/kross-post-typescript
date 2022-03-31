import * as cloudinary from 'cloudinary'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status?: string
  data?: any
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    // @ts-ignore
    cloudinary.config({
      cloud_name: 'dmxhfewt0',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    const public_id = req.query.public_id as string

    cloudinary.v2.api.delete_resources([public_id])

    res.status(200).json({ status: 'OK' })
  } catch (error) {
    res.status(500).json({ data: error })
  }
}
