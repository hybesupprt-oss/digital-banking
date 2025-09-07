"use client"

import { useEffect } from "react"

export default function FetchSafety() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const globalAny = window as any
    const originalFetch = globalAny.__original_fetch || window.fetch

    if ((originalFetch as any).__fetchSafetyWrapped) return

    const wrapped = function (this: any, ...args: any[]) {
      try {
        const result = originalFetch.apply(this, args)
        if (result && typeof result.then === "function") {
          return result.catch((err: unknown) => {
            // Log and rethrow so callers can handle rejections normally
            // Avoid leaking sensitive details
            console.warn("fetch-safety: fetch promise rejected", err)
            throw err
          })
        }
        return result
      } catch (err) {
        // If an instrumentation library throws synchronously, convert to a rejected promise
        console.warn("fetch-safety: synchronous fetch error caught", err)
        return Promise.reject(err)
      }
    }

    ;(wrapped as any).__fetchSafetyWrapped = true
    globalAny.__original_fetch = originalFetch
    try {
      window.fetch = wrapped as unknown as typeof window.fetch
    } catch (e) {
      // In very locked down environments assignment may fail; ignore
      console.warn("fetch-safety: failed to override window.fetch", e)
    }

    return () => {
      try {
        if (globalAny.__original_fetch) window.fetch = globalAny.__original_fetch
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return null
}
