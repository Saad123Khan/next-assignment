import { getServerSession} from "next-auth"

import { redirect } from "next/navigation"
import { authOptions, } from "@/app/api/auth/[...nextauth]/route"
import UsersTable from "@/components/UsersTable"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  console.log(session?.user?.roles,"ccc")

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user?.roles?.includes("admin")

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Portal</h2>
        <p className="mb-6">Hello, <b>{session.user.name}</b></p>
        <nav className="space-y-3">
          {isAdmin && <a href="#users" className="block text-gray-700 hover:text-blue-600">Manage Users</a>}
          {session?.user?.roles?.includes("editor") && <a href="#editor" className="block text-gray-700 hover:text-blue-600">Editor Section</a>}
          {session?.user?.roles?.includes("viewer") && <a href="#viewer" className="block text-gray-700 hover:text-blue-600">Viewer Section</a>}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {isAdmin && (
          <section id="users" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <UsersTable />
          </section>
        )}

        {session?.user?.roles?.includes("editor") && (
          <section id="editor" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Editor Section</h2>
            <p>You can edit content.</p>
          </section>
        )}

        {session?.user?.roles?.includes("viewer") && (
          <section id="viewer">
            <h2 className="text-2xl font-bold mb-4">Viewer Section</h2>
            <p>You can view content only.</p>
          </section>
        )}
      </main>
    </div>
  )
}
