/**
 * Authentication utilities using Web Crypto API instead of bcrypt
 * This is more compatible with serverless environments like Vercel
 */

// Convert string to ArrayBuffer for crypto operations
function stringToBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str)
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Generate a random salt
async function generateSalt(): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return bufferToHex(salt)
}

/**
 * Hash a password using PBKDF2 with SHA-256
 * @param password The plain text password to hash
 * @returns A string in the format "salt:hash"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await generateSalt()
  const passwordBuffer = stringToBuffer(password)
  const saltBuffer = stringToBuffer(salt)

  // Use PBKDF2 with 100,000 iterations and SHA-256
  const key = await crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, ["deriveBits"])

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  )

  return `${salt}:${bufferToHex(hash)}`
}

/**
 * Verify a password against a hash
 * @param password The plain text password to verify
 * @param storedHash The stored hash in the format "salt:hash"
 * @returns True if the password matches, false otherwise
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(":")

  if (!salt || !hash) {
    return false
  }

  const passwordBuffer = stringToBuffer(password)
  const saltBuffer = stringToBuffer(salt)

  const key = await crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, ["deriveBits"])

  const newHash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  )

  return bufferToHex(newHash) === hash
}
