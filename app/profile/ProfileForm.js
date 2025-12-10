"use client"

import { useState } from "react"

export default function ProfileForm({ session }) {
  const [name, setName] = useState(session.user.name || "")
  const [image, setImage] = useState(session.user.image || "")
  const [roles, setRoles] = useState(session.user.roles || [])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdate = async () => {
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        name,
        image,
        roles
      })
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("Profile updated successfully!")
    } else {
      setMessage(data.error || "Update failed")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold mb-4 text-black dark:text-white">Profile</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Name"
        />

        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="p-2 border rounded"
          placeholder="Image URL"
        />

        {session.user.roles.includes("admin") && (
          <select
            multiple
            value={roles}
            onChange={(e) => setRoles(Array.from(e.target.selectedOptions, opt => opt.value))}
            className="p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        )}

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {message && <p className="text-sm text-green-500">{message}</p>}
      </div>
    </div>
  )
}
