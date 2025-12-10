// app/api/users/delete/route.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { deleteUser } from "@/lib/db"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })

  try {
    const body = await req.json()
    const { userId } = body
    if (!userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 })

    await deleteUser(userId)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
