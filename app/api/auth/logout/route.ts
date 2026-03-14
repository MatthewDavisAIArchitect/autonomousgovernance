// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/session"

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/contribute", req.url))
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })
  return res
}
