import bonjour = require('bonjour')
import type { RemoteService } from 'bonjour'

/**
 * Discover Elgato Key Lights on the local network using mDNS
 *
 * This script searches for devices advertising the '_elg._tcp' service type,
 * which is used by Elgato Key Light, Key Light Air, Ring Light, and Light Strip.
 *
 * Usage: bun run scripts/discover.ts
 */

const DISCOVERY_TIMEOUT = 5000 // 5 seconds
const SERVICE_TYPE = 'elg'

const discoveredIPs = new Set<string>()

// Initialize Bonjour
const bonjourInstance = bonjour()

// Browse for Elgato devices
const browser = bonjourInstance.find({ type: SERVICE_TYPE })

browser.on('up', (service: RemoteService) => {
  // Extract IP addresses from the service
  // Bonjour may provide multiple addresses (IPv4 and IPv6)
  if (service.addresses && service.addresses.length > 0) {
    for (const address of service.addresses) {
      // Filter out IPv6 addresses and localhost
      if (
        !address.includes(':') &&
        address !== '127.0.0.1' &&
        address !== '0.0.0.0'
      ) {
        discoveredIPs.add(address)
      }
    }
  }
  // Fallback to referer.address if addresses array is not available
  else if (service.referer?.address) {
    const address = service.referer.address
    if (
      !address.includes(':') &&
      address !== '127.0.0.1' &&
      address !== '0.0.0.0'
    ) {
      discoveredIPs.add(address)
    }
  }
})

// Wait for discovery timeout, then print results and exit
setTimeout(() => {
  browser.stop()
  bonjourInstance.destroy()

  if (discoveredIPs.size === 0) {
    console.log('No Elgato Key Lights found on the network')
  } else {
    // Print each unique IP address on a separate line
    for (const ip of Array.from(discoveredIPs)) {
      console.log(ip)
    }
  }

  process.exit(0)
}, DISCOVERY_TIMEOUT)
