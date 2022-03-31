import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'

import Footer from '../components/footer'
import Header from '../components/header'
import Hero from '../components/hero'

const Home: NextPage = () => {
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
      <Header />
      <Hero />
      <Footer />
    </div>
  )
}

export default Home
