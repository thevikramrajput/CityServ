import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon connection string
export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Helper function to convert snake_case database results to camelCase
export function toCamelCase<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = obj[key]
    }
  }

  return result as T
}

// Helper function to convert array of snake_case objects to camelCase
export function toCamelCaseArray<T>(arr: Record<string, any>[]): T[] {
  return arr.map((item) => toCamelCase<T>(item))
}
