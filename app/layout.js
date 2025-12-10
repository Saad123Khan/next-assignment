import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from './providers'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function RootLayout({ children }) {
   const session = await getServerSession(authOptions)
   console.log(session,"session")

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar session={session} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
