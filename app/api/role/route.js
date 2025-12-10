import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { setUserRole, findUserByEmail } from "@/lib/db"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })
    }

    const { userId, roles } = await req.json()

    if (!roles?.length) {
      return new Response(JSON.stringify({ error: "Invalid roles" }), { status: 400 })
    }

    let targetUserId = userId

    if (!targetUserId) {
      const user = await findUserByEmail(session.user.email)
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
      }
      targetUserId = user.id
    }

    const updatedUser = await setUserRole(targetUserId, roles)

    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (err) {
    console.error("ROLE API ERROR:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
