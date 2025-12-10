import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { setUserRole, upsertUser } from "@/lib/db"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })

  try {
    const body = await req.json()
    const { userId, name, image, roles } = body

    if (roles && !session.user.roles.includes("admin")) {
      return new Response(JSON.stringify({ error: "Forbidden to update roles" }), { status: 403 })
    }

    let updatedUser = await upsertUser({
      email: body.email, 
      name,
      image,
      provider: "local", 
      providerAccountId: userId, 
      role: roles?.[0] || undefined
    })

    if (roles && roles.length > 0) {
      updatedUser = await setUserRole(userId, roles)
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
