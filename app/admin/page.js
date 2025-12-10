import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (!session.user.roles?.includes('admin')) redirect('/unauthorized')

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  )
}
