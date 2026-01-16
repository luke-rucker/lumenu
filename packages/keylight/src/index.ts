/**
 * @lumenu/keylight - Elgato Key Light API client
 *
 * @example
 * ```typescript
 * import { Keylight } from '@lumenu/keylight';
 *
 * const keylight = new Keylight('192.168.1.61');
 *
 * // Turn on and set to 50% brightness
 * await keylight.turnOn();
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

export { Keylight, Temperature } from './keylight.js'
export type { HttpClient, HttpResponse } from './http-client.js'
export { FetchHttpClient } from './http-client.js'
export {
  KeylightError,
  KeylightConnectionError,
  KeylightBadRequestError,
  KeylightValidationError,
} from './errors.js'
export type {
  AccessoryInfo,
  AccessoryInfoUpdate,
  Light,
  LightsStatus,
  LightUpdate,
  LightsUpdate,
  LightSettings,
  LightSettingsUpdate,
} from './types.js'
