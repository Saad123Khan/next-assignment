"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export default function ProfilePageClient({ session }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone!")) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete account")

      signOut({ callbackUrl: "/" })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold mb-4 text-black dark:text-white">Profile</h1>

      <div className="flex flex-col items-center gap-4">
        {session.user.image && (
          <img src={session?.user?.image} alt="Avatar" className="w-24 h-24 rounded-full" />
        )}

        <p className="text-lg text-black dark:text-white">
          <strong>Name:</strong> {session?.user?.name}
        </p>
        <p className="text-lg text-black dark:text-white">
          <strong>Email:</strong> {session?.user?.email}
        </p>
        <p className="text-lg text-black dark:text-white">
          <strong>Roles:</strong> {session?.user?.roles?.[0]}
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleDelete}
          disabled={loading}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  )
}
