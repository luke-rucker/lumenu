import bonjour = require('bonjour')
import type { RemoteService } from 'bonjour'

export namespace Mdns {
  const isLocalhost = (address: string) =>
    address === '127.0.0.1' || address === '0.0.0.0' || address === '::1'

  const isIPv6 = (address: string) => address.includes(':')

  export function discover({
    serviceType,
    timeout = 5000,
  }: {
    serviceType: string
    timeout?: number
  }): Promise<string[]> {
    const bonjourInstance = bonjour()
    const browser = bonjourInstance.find({ type: serviceType })

    const discoveredIPs = new Set<string>()

    browser.on('up', (service: RemoteService) => {
      if (service.addresses && service.addresses.length > 0) {
        for (const address of service.addresses) {
          if (!isIPv6(address) && !isLocalhost(address)) {
            discoveredIPs.add(address)
          }
        }
      } else if (service.referer?.address) {
        const address = service.referer.address
        if (!isIPv6(address) && !isLocalhost(address)) {
          discoveredIPs.add(address)
        }
      }
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        browser.stop()
        bonjourInstance.destroy()
        resolve(Array.from(discoveredIPs))
      }, timeout)
    })
  }
}
