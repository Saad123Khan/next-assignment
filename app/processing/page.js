"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession ,signIn,getSession } from "next-auth/react";

export default function ProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const role = searchParams.get("role") || "viewer";

  useEffect(() => {
    if (status !== "authenticated") return;

    const updateRole = async () => {
      try {
        await fetch("/api/role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roles: [role],
          }),
        });
          await fetch("/api/auth/session?update"); 
        const newSession = await getSession()
console.log("UPDATED SESSION:", newSession)
        router.replace("/dashboard"); 
      } catch (err) {
        console.error("Role update failed", err);
        router.replace("/dashboard");
      }
    };

    updateRole();
  }, [status, role, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-black rounded-full" />
      <p className="mt-4 text-gray-600">Setting up your account...</p>
    </div>
  );
}
