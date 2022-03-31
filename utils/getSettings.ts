import { getAccessToken, getSession } from "@auth0/nextjs-auth0"
import axios from "axios"

export const getSettings = async (ctx:any)=>{
    const { accessToken } = await getAccessToken(ctx.req, ctx.res)
    const response = await getSession(ctx.req, ctx.res)
  
    const HASURA_ADMIN_SECRET = process.env.HASURA_SECRET
  
    const headers = {
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET as string,
      Authorization: accessToken as string,
      'content-type': 'application/json',
    }
  
    const operation = 'getSettings'
    const variables = { user_id: response?.user.sub }
    const operationsDoc = `
      query getSettings($user_id: String = "") {
        settings(where: {user_id: {_eq: $user_id}}) {
          forem_key
          hashnode_key
          id
          medium_key
          hashnode_publication_id
        }
      }
    `
  
    const settingsResponse = await axios({
      method: 'POST',
      headers: headers,
      url: 'https://crucial-hamster-60.hasura.app/v1/graphql',
      data: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operation,
      }),
    })

    return settingsResponse;
  
}
export default getSettings