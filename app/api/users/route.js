import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { listUsers } from "@/lib/db"

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
  if (!session.user.roles?.includes('admin')) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

  const users = await listUsers()
  return new Response(JSON.stringify(users), { status: 200 })
}
