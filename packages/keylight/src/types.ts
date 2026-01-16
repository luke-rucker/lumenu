/**
 * Elgato Key Light API Types
 */

/**
 * Accessory information returned from the device
 */
export interface AccessoryInfo {
  productName: string
  hardwareBoardType: number
  firmwareBuildNumber: number
  firmwareVersion: string
  serialNumber: string
  displayName: string
  features: string[]
}

/**
 * Partial accessory info for updates
 */
export type AccessoryInfoUpdate = Partial<AccessoryInfo>

/**
 * Individual light state
 */
export interface Light {
  /** Power state: 0 = off, 1 = on */
  on: 0 | 1
  /** Brightness percentage: 0-100 */
  brightness: number
  /** Temperature in API format: 143-344 (representing ~7000K-2900K) */
  temperature: number
}

/**
 * Lights status response
 */
export interface LightsStatus {
  numberOfLights: number
  lights: Light[]
}

/**
 * Partial light state for updates
 */
export interface LightUpdate {
  on?: 0 | 1
  brightness?: number
  temperature?: number
}

/**
 * Lights update request payload
 */
export interface LightsUpdate {
  numberOfLights: number
  lights: LightUpdate[]
}

/**
 * Light settings configuration
 */
export interface LightSettings {
  /** Power-on behavior: 0 = restore last state, 1 = use default settings */
  powerOnBehavior: 0 | 1
  /** Default brightness when powered on: 0-100 */
  powerOnBrightness: number
  /** Default temperature when powered on: 143-344 */
  powerOnTemperature: number
  /** Fade-in duration in milliseconds */
  switchOnDurationMs: number
  /** Fade-out duration in milliseconds */
  switchOffDurationMs: number
  /** Color/brightness transition duration in milliseconds */
  colorChangeDurationMs: number
}

/**
 * Partial settings for updates
 */
export type LightSettingsUpdate = Partial<LightSettings>
