// lib/session.ts
// Session cookie encrypt/decrypt using Node built-in crypto only.
import crypto from "crypto"

export interface SessionData {
  orcidHash: string
  eligible: boolean
}

function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not set")
  return crypto.scryptSync(secret, "uftagp-session-v1", 32) as Buffer
}

export function encryptSession(data: SessionData): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const plain = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString("base64url")
}

export function decryptSession(token: string): SessionData | null {
  try {
    const key = getKey()
    const buf = Buffer.from(token, "base64url")
    const iv = buf.subarray(0, 12)
    const tag = buf.subarray(12, 28)
    const encrypted = buf.subarray(28)
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(tag)
    const plain = decipher.update(encrypted) + decipher.final("utf8")
    return JSON.parse(plain) as SessionData
  } catch {
    return null
  }
}

export const SESSION_COOKIE = "uftagp-session"
export const SESSION_MAX_AGE = 86400
