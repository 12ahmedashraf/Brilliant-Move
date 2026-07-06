import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "bm_session";
const ADMIN_COOKIE = "bm_admin";

function getSecret() {
  return process.env.SESSION_SECRET || "change-me-in-production-brilliant-move-2026";
}

function sign(data) {
  const secret = getSecret();
  const hmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${hmac}`;
}

function verify(token) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = sign(data).split(".")[1];
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return data;
}

export async function setTeamSession(teamId) {
  const cookieStore = await cookies();
  const token = sign(String(teamId));
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getTeamIdFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const data = verify(token);
  return data || null;
}

export async function clearTeamSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sign("admin"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const data = verify(token);
  return data === "admin";
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
