import '../styles/globals.css'

import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  )
}

export default MyApp
