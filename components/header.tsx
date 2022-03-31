import { useUser } from '@auth0/nextjs-auth0'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import Profile from '../components/menu'

const Header = () => {
  const { user } = useUser()
  const { systemTheme, theme, setTheme } = useTheme()

  const router = useRouter()

  const isCreate = router.pathname === '/create'

  const renderThemeToggle = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme
    if (currentTheme === 'dark') {
      return (
        <SunIcon
          className="mr-8 h-8 w-8 cursor-pointer"
          onClick={() => setTheme('light')}
          type="button"
        />
      )
    }
    return (
      <MoonIcon
        className="mr-8 h-8 w-8 cursor-pointer"
        onClick={() => setTheme('dark')}
      />
    )
  }

  return (
    <header className="body-font text-gray-600">
      <div className="container mx-auto flex h-28 min-h-0   flex-row flex-wrap items-center px-5">
        <Link href="/" passHref>
          <a className="title-font mb-0 flex items-center font-medium text-gray-900">
            <span className="dark:text-white font text-xl tracking-wide text-black">
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
                <button className="inline-flex rounded border-0 bg-indigo-500 py-2 px-6 text-sm tracking-wider text-white hover:bg-indigo-600 focus:outline-none">
                  REGISTER
                </button>
              </Link>
            </>
          ) : (
            <>
              {!isCreate && (
                <Link href="/create" passHref>
                  <a className="mr-8 inline-flex items-end text-sm font-bold hover:text-gray-900  text-gray-800  dark:text-white">
                    CREATE POST
                  </a>
                </Link>
              )}

              {renderThemeToggle()}

              <Profile image={user.picture} />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
