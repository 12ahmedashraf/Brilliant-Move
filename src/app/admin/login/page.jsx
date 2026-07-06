"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-header font-black text-white text-2xl md:text-3xl uppercase tracking-wide">
            Admin
          </h1>
          <p className="text-white/40 text-xs font-poppins mt-1">Enter the admin password</p>
        </div>

        <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-6 md:p-8">
          <form action={formAction} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              required
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30"
            />
            {state?.error && (
              <p className="text-red-400 text-xs font-poppins bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="bg-accent text-black text-sm font-poppins font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-white/30 text-xs font-poppins mt-4 text-center">
            Team login <a href="/login" className="text-accent underline hover:text-white transition-colors">here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
