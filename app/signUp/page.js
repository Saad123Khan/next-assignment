"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "google";
  const role = searchParams.get("role") || "viewer";

  useEffect(() => {
    signIn(provider, {
      callbackUrl: "/dashboard",
      role,
    });
  }, [provider, role]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">Signing up with {provider}</h2>
        <p>Please wait, redirecting...</p>
      </div>
    </div>
  );
}
