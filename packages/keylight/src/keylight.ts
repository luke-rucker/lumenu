import type {
  AccessoryInfo,
  AccessoryInfoUpdate,
  LightsStatus,
  LightUpdate,
  LightsUpdate,
  LightSettings,
  LightSettingsUpdate,
} from './types.js'
import {
  KeylightConnectionError,
  KeylightBadRequestError,
  KeylightValidationError,
} from './errors.js'
import type { HttpClient } from './http-client.js'
import { FetchHttpClient } from './http-client.js'

/**
 * Temperature conversion utilities
 */
export class Temperature {
  /**
   * Convert Kelvin to Keylight API format
   * Formula: temperature = (1000000 / kelvin) - 10
   * @param kelvin Temperature in Kelvin (2900-7000)
   * @returns Temperature in API format (143-344)
   */
  static kelvinToApi(kelvin: number): number {
    if (kelvin < 2900 || kelvin > 7000) {
      throw new KeylightValidationError('kelvin', kelvin, 2900, 7000)
    }
    return Math.round(1000000 / kelvin - 10)
  }

  /**
   * Convert Keylight API format to Kelvin
   * Formula: kelvin = 1000000 / (temperature + 10)
   * @param temperature Temperature in API format (143-344)
   * @returns Temperature in Kelvin (2900-7000)
   */
  static apiToKelvin(temperature: number): number {
    if (temperature < 143 || temperature > 344) {
      throw new KeylightValidationError('temperature', temperature, 143, 344)
    }
    return Math.round(1000000 / (temperature + 10))
  }
}

/**
 * Elgato Key Light client
 *
 * @example
 * ```typescript
 * const keylight = new Keylight("192.168.1.61");
 *
 * // Turn on the light
 * await keylight.turnOn();
 *
 * // Set brightness to 50%
 * await keylight.setBrightness(50);
 *
 * // Set temperature to 4000K
 * await keylight.setTemperatureKelvin(4000);
 *
 * // Get current status
 * const status = await keylight.getLights();
 * console.log(status);
 * ```
 */
export class Keylight {
  private readonly baseUrl: string
  private readonly httpClient: HttpClient

  /**
   * Create a new Keylight client
   * @param ip IP address of the Keylight device
   * @param httpClient Optional HTTP client for testing (defaults to FetchHttpClient)
   */
  constructor(ip: string, httpClient?: HttpClient) {
    this.baseUrl = `http://${ip}:9123/elgato`
    this.httpClient = httpClient ?? new FetchHttpClient()
  }

  /**
   * Flash the light to identify the device
   */
  async identify(): Promise<void> {
    try {
      const response = await this.httpClient.post<void>(
        `${this.baseUrl}/identify`
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/identify')
      }
    } catch (error) {
      if (error instanceof KeylightBadRequestError) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Get device accessory information
   */
  async getAccessoryInfo(): Promise<AccessoryInfo> {
    try {
      const response = await this.httpClient.get<AccessoryInfo>(
        `${this.baseUrl}/accessory-info`
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/accessory-info')
      }

      return response.data
    } catch (error) {
      if (error instanceof KeylightBadRequestError) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Update device accessory information
   * @param info Partial accessory info to update
   */
  async updateAccessoryInfo(info: AccessoryInfoUpdate): Promise<AccessoryInfo> {
    try {
      const response = await this.httpClient.put<AccessoryInfo>(
        `${this.baseUrl}/accessory-info`,
        info
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/accessory-info')
      }

      return response.data
    } catch (error) {
      if (error instanceof KeylightBadRequestError) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Get current lights status
   */
  async getLights(): Promise<LightsStatus> {
    try {
      const response = await this.httpClient.get<LightsStatus>(
        `${this.baseUrl}/lights`
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/lights')
      }

      return response.data
    } catch (error) {
      if (error instanceof KeylightBadRequestError) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Update lights status
   * @param lights Lights update configuration
   */
  async updateLights(lights: LightsUpdate): Promise<LightsStatus> {
    // Validate brightness values
    for (const light of lights.lights) {
      if (light.brightness !== undefined) {
        if (light.brightness < 0 || light.brightness > 100) {
          throw new KeylightValidationError(
            'brightness',
            light.brightness,
            0,
            100
          )
        }
      }
      if (light.temperature !== undefined) {
        if (light.temperature < 143 || light.temperature > 344) {
          throw new KeylightValidationError(
            'temperature',
            light.temperature,
            143,
            344
          )
        }
      }
    }

    try {
      const response = await this.httpClient.put<LightsStatus>(
        `${this.baseUrl}/lights`,
        lights
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/lights')
      }

      return response.data
    } catch (error) {
      if (
        error instanceof KeylightBadRequestError ||
        error instanceof KeylightValidationError
      ) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Get light settings
   */
  async getSettings(): Promise<LightSettings> {
    try {
      const response = await this.httpClient.get<LightSettings>(
        `${this.baseUrl}/lights/settings`
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/lights/settings')
      }

      return response.data
    } catch (error) {
      if (error instanceof KeylightBadRequestError) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  /**
   * Update light settings
   * @param settings Partial settings to update
   */
  async updateSettings(settings: LightSettingsUpdate): Promise<LightSettings> {
    // Validate settings values
    if (settings.powerOnBrightness !== undefined) {
      if (settings.powerOnBrightness < 0 || settings.powerOnBrightness > 100) {
        throw new KeylightValidationError(
          'powerOnBrightness',
          settings.powerOnBrightness,
          0,
          100
        )
      }
    }
    if (settings.powerOnTemperature !== undefined) {
      if (
        settings.powerOnTemperature < 143 ||
        settings.powerOnTemperature > 344
      ) {
        throw new KeylightValidationError(
          'powerOnTemperature',
          settings.powerOnTemperature,
          143,
          344
        )
      }
    }

    try {
      const response = await this.httpClient.put<LightSettings>(
        `${this.baseUrl}/lights/settings`,
        settings
      )

      if (!response.ok) {
        throw new KeylightBadRequestError('/lights/settings')
      }

      return response.data
    } catch (error) {
      if (
        error instanceof KeylightBadRequestError ||
        error instanceof KeylightValidationError
      ) {
        throw error
      }
      throw new KeylightConnectionError(this.baseUrl, error as Error)
    }
  }

  // Convenience methods for common operations

  /**
   * Turn on the light (preserves current brightness and temperature)
   */
  async turnOn(): Promise<LightsStatus> {
    return this.updateLights({
      numberOfLights: 1,
      lights: [{ on: 1 }],
    })
  }

  /**
   * Turn off the light (preserves current brightness and temperature)
   */
  async turnOff(): Promise<LightsStatus> {
    return this.updateLights({
      numberOfLights: 1,
      lights: [{ on: 0 }],
    })
  }

  /**
   * Set brightness percentage (0-100)
   * @param brightness Brightness percentage (0-100)
   */
  async setBrightness(brightness: number): Promise<LightsStatus> {
    if (brightness < 0 || brightness > 100) {
      throw new KeylightValidationError('brightness', brightness, 0, 100)
    }

    return this.updateLights({
      numberOfLights: 1,
      lights: [{ brightness }],
    })
  }

  /**
   * Set temperature in Kelvin (2900-7000)
   * @param kelvin Temperature in Kelvin (2900-7000)
   */
  async setTemperatureKelvin(kelvin: number): Promise<LightsStatus> {
    const temperature = Temperature.kelvinToApi(kelvin)
    return this.setTemperature(temperature)
  }

  /**
   * Set temperature in API format (143-344)
   * @param temperature Temperature in API format (143-344)
   */
  async setTemperature(temperature: number): Promise<LightsStatus> {
    if (temperature < 143 || temperature > 344) {
      throw new KeylightValidationError('temperature', temperature, 143, 344)
    }

    return this.updateLights({
      numberOfLights: 1,
      lights: [{ temperature }],
    })
  }

  /**
   * Set multiple properties at once
   * @param options Light properties to set
   */
  async setLight(options: LightUpdate): Promise<LightsStatus> {
    return this.updateLights({
      numberOfLights: 1,
      lights: [options],
    })
  }
}
