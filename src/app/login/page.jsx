"use client";

import { useActionState } from "react";
import { loginTeam } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginTeam, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-header font-black text-white text-2xl md:text-3xl uppercase tracking-wide">
            Brilliant Move
          </h1>
          <p className="text-white/40 text-xs font-poppins mt-1">Sign in to your team dashboard</p>
        </div>

        <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-6 md:p-8">
          <h2 className="font-header font-bold text-white text-sm mb-4">Team Login</h2>
          <form action={formAction} className="flex flex-col gap-3">
            <input
              name="username"
              placeholder="Username"
              required
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
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
        </div>
      </div>
    </div>
  );
}
