import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Profile from '../components/menu'

const Header = () => {
  const { user } = useUser()

  const router = useRouter()

  const isCreate = router.pathname === '/create'

  return (
    <header className="body-font text-gray-600">
      <div className="container mx-auto flex h-28 min-h-0   flex-row flex-wrap items-center px-5">
        <Link href="/" passHref>
          <a className="title-font mb-0 flex items-center font-medium text-gray-900">
            <span className="font text-xl tracking-wide text-black dark:text-white">
              kross post
            </span>
          </a>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center justify-center text-base">
          {!user ? (
            <>
              <Link href="/api/auth/login" passHref>
                <a className="mr-8 inline-flex items-end text-sm font-bold hover:text-gray-900">
                  LOG IN
                </a>
              </Link>

              <Link href="/api/signup" passHref>
                <button className="inline-flex rounded border-0 bg-slate-900 py-2 px-6 text-sm tracking-wider text-white focus:outline-none">
                  REGISTER
                </button>
              </Link>
            </>
          ) : (
            <>
              {!isCreate && (
                <Link href="/create" passHref>
                  <a className="mr-8 inline-flex items-end text-sm font-bold text-gray-800  hover:text-gray-900  dark:text-white">
                    CREATE POST
                  </a>
                </Link>
              )}
              <Link href="/posts" passHref>
                <a className="mr-8 inline-flex items-end text-sm font-bold text-gray-800  hover:text-gray-900  dark:text-white">
                  DASHBOARD
                </a>
              </Link>
              <Profile image={user.picture} />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
