"use server";

import { redirect } from "next/navigation";
import { setAdminSession, clearAdminSession } from "@/lib/session";

export async function loginAdmin(prevState, formData) {
  const password = String(formData.get("password") || "");

  if (!password) return { error: "Password required." };

  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || password !== adminPass) return { error: "Invalid admin password." };

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
