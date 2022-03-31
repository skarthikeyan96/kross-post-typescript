import { getSession } from '@auth0/nextjs-auth0'
import Script from 'next/script'

import Header from '../components/header'

function Profile(props: any) {
  const { user } = props
  return (
    <>
      <Header />
      <Script src="https://kit.fontawesome.com/60d7c5aa6b.js"></Script>

      <section className="block h-96">
        <img
          alt="profile background"
          className="h-full w-full bg-cover bg-center"
          src="https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80"
          loading="lazy"
        />
        <span className="h-full w-full bg-black opacity-50"></span>
      </section>
      <section>
        <div className="relative mx-auto flex w-full items-center justify-center px-4 lg:order-2 lg:w-3/12">
          <img
            alt="..."
            src={user.picture}
            className="absolute h-auto w-1/3 max-w-sm rounded-full border-none  align-middle shadow-xl"
          />
        </div>
      </section>
      <div className="mt-20 text-center">
        <h3 className="tracking  text-blueGray-700 mb-2 text-4xl leading-normal tracking-wider">
          {user.nickname}.
        </h3>
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res }: any) {
  const session = await getSession(req, res)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: '/api/auth/login',
    })
    res.end()
    return
  }

  return { props: { user: session.user } }
}

export default Profile
