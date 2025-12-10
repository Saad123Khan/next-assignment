"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [role, setRole] = useState("viewer");

  const handleLogin = async (provider) => {
  await signIn(provider, {
    callbackUrl: `/processing?role=${role}`, 
  });
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Select Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <div className="space-y-2">
          <button
            onClick={() => handleLogin("google")}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Login with Google
          </button>
          <button
            onClick={() => handleLogin("github")}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
