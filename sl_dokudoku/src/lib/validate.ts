import { z } from 'zod'

interface ValidationResult<T> {
  success: boolean
  error?: {
    message: string
    errors: Array<{
      path: string[]
      message: string
    }>
  }
  data?: T
}

export async function validateRequest<T extends Record<string, any>>(
  data: Partial<T>,
  schemas: Record<string, z.ZodType>
): Promise<ValidationResult<T>> {
  try {
    const validatedData: Partial<T> = {}
    const errors: Array<{ path: string[]; message: string }> = []

    for (const [key, schema] of Object.entries(schemas)) {
      try {
        const value = await schema.parseAsync(data[key])
        validatedData[key as keyof T] = value
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(
            ...error.errors.map(err => ({
              path: [key, ...err.path.map(String)],
              message: err.message
            }))
          )
        }
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          errors
        }
      }
    }

    return {
      success: true,
      data: validatedData as T
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        errors: [{
          path: [],
          message: error instanceof Error ? error.message : 'Unknown error'
        }]
      }
    }
  }
} 