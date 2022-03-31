import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import util from 'node:util'
import request from 'request'

export default withApiAuthRequired(async function graphQL(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res)
    const headers = {
      // Attach token to header
      Authorization: `Bearer ${accessToken}`,
      'x-hasura-admin-secret': process.env.HASURA_SECRET,
      // Set content type to JSON
      'Content-Type': 'application/json',
    }
    const asyncReqPost = util.promisify(request.post)
    // Send request
    const graphQLApiResponse = await asyncReqPost({
      url: `https://crucial-hamster-60.hasura.app/v1/graphql`,
      headers,
      json: req.body,
      timeout: 5000, // give queries more time to run
      gzip: true,
    })
    // Set response header
    res.setHeader('Content-Type', 'application/json')
    // Send response
    res.end(JSON.stringify(graphQLApiResponse.body))
  } catch (error: any) {
    res.status(error.status || 500).end(error.message)
  }
})
