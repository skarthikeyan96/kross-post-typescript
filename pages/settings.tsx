import { getAccessToken } from '@auth0/nextjs-auth0'
import { getSession } from '@auth0/nextjs-auth0'
import axios from 'axios'
import type { NextPage } from 'next'

import Header from '../components/header'
import SettingsForm from '../components/settingsForm'
import Wrapper from '../components/wrapper'
import withApollo from '../utils/withApollo'

const Settings: NextPage = (props: any) => {
  const { settings } = props
  return (
    <>
      <Header />
      <Wrapper>
        <>
          <SettingsForm preloadedValues={settings[0]} />
        </>
      </Wrapper>
    </>
  )
}

export const getServerSideProps = async (ctx: any) => {
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
        medium_username
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

  return {
    props: {
      settings: settingsResponse.data.data.settings,
    },
  }
}

export default withApollo(Settings)
