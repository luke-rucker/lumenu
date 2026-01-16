# @lumenu/keylight

TypeScript client for controlling Elgato Key Light and Key Light Air devices.

## Installation

```bash
bun add @lumenu/keylight
```

## Features

- 🔌 Full API coverage for Elgato Key Light
- 🧪 Deeply testable with dependency injection
- 📝 Complete TypeScript types
- ✅ Input validation
- 🎯 Ergonomic convenience methods
- 🚦 Typed error handling

## Usage

### Basic Usage

```typescript
import { Keylight } from '@lumenu/keylight'

// Create a client (use your Key Light's IP address)
const keylight = new Keylight('192.168.1.61')

// Turn on the light
await keylight.turnOn()

// Set brightness to 50%
await keylight.setBrightness(50)

// Set color temperature to 4000K
await keylight.setTemperatureKelvin(4000)

// Turn off
await keylight.turnOff()
```

### Advanced Usage

```typescript
// Get current status
const status = await keylight.getLights()
console.log(status)
// {
//   numberOfLights: 1,
//   lights: [{ on: 1, brightness: 50, temperature: 240 }]
// }

// Update multiple properties at once
await keylight.setLight({
  on: 1,
  brightness: 75,
  temperature: 250,
})

// Get device information
const info = await keylight.getAccessoryInfo()
console.log(info.displayName, info.firmwareVersion)

// Update device name
await keylight.updateAccessoryInfo({
  displayName: 'My Studio Light',
})

// Get and update settings
const settings = await keylight.getSettings()
await keylight.updateSettings({
  powerOnBehavior: 1,
  powerOnBrightness: 20,
})

// Identify device (flashes the light)
await keylight.identify()
```

### Temperature Conversion

The Key Light uses a custom temperature format internally. The client provides utilities for conversion:

```typescript
import { Temperature } from '@lumenu/keylight'

// Convert Kelvin to API format
const apiTemp = Temperature.kelvinToApi(4000) // 240

// Convert API format to Kelvin
const kelvin = Temperature.apiToKelvin(240) // 4000
```

## API Reference

### Constructor

```typescript
new Keylight(ip: string, httpClient?: HttpClient)
```

- `ip` - IP address of your Key Light device
- `httpClient` - Optional custom HTTP client (for testing)

### Methods

#### Control Methods

- `turnOn()` - Turn on the light
- `turnOff()` - Turn off the light
- `setBrightness(brightness: number)` - Set brightness (0-100)
- `setTemperatureKelvin(kelvin: number)` - Set temperature in Kelvin (2900-7000)
- `setTemperature(temperature: number)` - Set temperature in API format (143-344)
- `setLight(options: LightUpdate)` - Set multiple properties at once

#### Core API Methods

- `getLights()` - Get current light status
- `updateLights(lights: LightsUpdate)` - Update light status
- `getAccessoryInfo()` - Get device information
- `updateAccessoryInfo(info: AccessoryInfoUpdate)` - Update device information
- `getSettings()` - Get device settings
- `updateSettings(settings: LightSettingsUpdate)` - Update device settings
- `identify()` - Flash the light to identify the device

### Error Handling

The client throws typed errors for better error handling:

```typescript
import {
  KeylightConnectionError,
  KeylightBadRequestError,
  KeylightValidationError,
} from '@lumenu/keylight'

try {
  await keylight.setBrightness(150) // Invalid value
} catch (error) {
  if (error instanceof KeylightValidationError) {
    console.error(`Validation error: ${error.message}`)
    console.error(`Field: ${error.field}, Value: ${error.value}`)
  } else if (error instanceof KeylightConnectionError) {
    console.error(`Connection failed: ${error.message}`)
  } else if (error instanceof KeylightBadRequestError) {
    console.error(`Bad request to ${error.endpoint}`)
  }
}
```

## Testing

The client is designed for easy testing with dependency injection:

```typescript
import { Keylight } from '@lumenu/keylight'
import type { HttpClient, HttpResponse } from '@lumenu/keylight'

// Create a mock HTTP client
class MockHttpClient implements HttpClient {
  async get<T>(url: string): Promise<HttpResponse<T>> {
    return { ok: true, status: 200, data: mockData as T }
  }

  async put<T>(url: string, body: unknown): Promise<HttpResponse<T>> {
    return { ok: true, status: 200, data: mockData as T }
  }

  async post<T>(url: string, body?: unknown): Promise<HttpResponse<T>> {
    return { ok: true, status: 200, data: null as T }
  }
}

// Inject mock client for testing
const keylight = new Keylight('192.168.1.61', new MockHttpClient())

// Now you can test without making real HTTP requests
await keylight.turnOn()
```

Run the tests:

```bash
bun test
```

## API Documentation

For complete API documentation, see [API_REFERENCE.md](./API_REFERENCE.md).

## License

MIT
