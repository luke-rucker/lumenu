/**
 * Base error class for all Keylight errors
 */
export class KeylightError extends Error {
  override name = 'KeylightError'

  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown when connection to the device fails
 */
export class KeylightConnectionError extends KeylightError {
  override name = 'KeylightConnectionError'
  public readonly ip: string
  public override readonly cause?: Error

  constructor(ip: string, cause?: Error) {
    super(`Failed to connect to Keylight at ${ip}`)
    this.ip = ip
    this.cause = cause
  }
}

/**
 * Error thrown when the device returns a 400 Bad Request
 */
export class KeylightBadRequestError extends KeylightError {
  override name = 'KeylightBadRequestError'
  public readonly endpoint: string
  public readonly details?: string

  constructor(endpoint: string, details?: string) {
    super(`Bad request to ${endpoint}${details ? `: ${details}` : ''}`)
    this.endpoint = endpoint
    this.details = details
  }
}

/**
 * Error thrown when a value is out of the valid range
 */
export class KeylightValidationError extends KeylightError {
  override name = 'KeylightValidationError'
  public readonly field: string
  public readonly value: number
  public readonly min: number
  public readonly max: number

  constructor(field: string, value: number, min: number, max: number) {
    super(`${field} must be between ${min} and ${max}, got ${value}`)
    this.field = field
    this.value = value
    this.min = min
    this.max = max
  }
}
