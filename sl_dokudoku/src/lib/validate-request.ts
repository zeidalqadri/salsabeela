import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.Schema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', ')
      }
    }
    return { success: false, error: 'Invalid request body' }
  }
} 