// app/profile/page.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ProfilePageClient from "./ProfilePageClient"
import ProfileForm from "./ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  console.log(session,"sessionsession")
  if (!session) redirect("/login")

  return <ProfilePageClient session={session} />
}
