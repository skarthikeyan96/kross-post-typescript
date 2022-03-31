import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'

const Profile: NextPage = () => {
  useEffect(() => {
    // @ts-ignore
    import('tw-elements')
  }, [])

  return (
    <div>
      <Head>
        <title>Kross post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Profile
