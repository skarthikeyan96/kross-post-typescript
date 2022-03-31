import { getAccessToken } from '@auth0/nextjs-auth0'
import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Header from '../components/header'
import Wrapper from '../components/wrapper'

const Posts: NextPage = (props: any) => {
  const renderPost = () => {
    if (props.post.length === 0) {
      return (
        <p>
          {' '}
          No posts added , <Link href="/create"> Create Post </Link>
        </p>
      )
    }

    return props.post.map((post: any) => {
      return (
        <div
          className="flex flex-wrap py-4 dark:text-white md:flex-nowrap"
          key={post.post_id}
        >
          <div className="md:flex-grow">
            <a
              className="text-black-500 mt-4"
              href={post.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              <h2 className="title-font mb-2 text-2xl font-medium text-gray-900 dark:text-white">
                {post.post_name}
              </h2>
              <p className="leading-relaxed text-slate-400">
                {' '}
                by {post.author}
              </p>
            </a>
            <div className="flex items-center">
              {/**
               * render the status of the published blogs
               */}
            </div>
          </div>
        </div>
      )
    })
  }
  return (
    <div>
      <Head>
        <title>Kross post</title>
        <meta name="description" content="Kross post | Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Wrapper>
        <section className="body-font overflow-hidden text-gray-600">
          <div className="mx-auto py-24">
            <div className="-my-8">{renderPost()}</div>
          </div>
        </section>
      </Wrapper>
    </div>
  )
}

export const getServerSideProps = async (ctx: any) => {
  // get the data from the graphql server and send it as props
  const { accessToken } = await getAccessToken(ctx.req, ctx.res)
  const HASURA_ADMIN_SECRET = process.env.HASURA_SECRET

  const headers = {
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET as string,
    Authorization: accessToken as string,
    'content-type': 'application/json',
  }

  const operation = 'GetPostQuery'
  const variables = {}
  const operationsDoc = `
        query GetPostQuery {
            post {
            medium
            link
            hashnode
            forem
            author
            post_created_at
            post_id
            post_name
            }
        }
    `

  const response = await axios({
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
      post: response.data.data.post,
    },
  }
}

export default Posts
