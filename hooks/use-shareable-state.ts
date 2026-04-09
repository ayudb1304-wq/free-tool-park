"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState } from "react"

interface UseShareableStateOptions<T> {
  defaultValues: T
  shareableKeys: (keyof T)[]
  encode?: (key: keyof T, value: T[keyof T]) => string
  decode?: (key: keyof T, value: string) => T[keyof T]
}

export function useShareableState<T extends Record<string, unknown>>({
  defaultValues,
  shareableKeys,
  encode = (_, v) => String(v),
  decode = (_, v) => v as T[keyof T],
}: UseShareableStateOptions<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const getInitialState = useCallback((): T => {
    const state = { ...defaultValues }
    shareableKeys.forEach((key) => {
      const urlValue = searchParams.get(String(key))
      if (urlValue !== null) {
        state[key] = decode(key, urlValue)
      }
    })
    return state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const [state, setState] = useState<T>(getInitialState)
  const [hasResult, setHasResult] = useState(false)

  const getShareableUrl = useCallback((): string => {
    const params = new URLSearchParams()
    shareableKeys.forEach((key) => {
      const value = state[key]
      if (value !== undefined && value !== null && value !== "") {
        params.set(String(key), encode(key, value))
      }
    })
    const base = typeof window !== "undefined" ? window.location.origin : ""
    return `${base}${pathname}?${params.toString()}`
  }, [state, shareableKeys, pathname, encode])

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    shareableKeys.forEach((key) => {
      const value = state[key]
      if (value !== undefined && value !== null && value !== "") {
        params.set(String(key), encode(key, value))
      }
    })
    const newUrl = `${pathname}?${params.toString()}`
    window.history.replaceState({}, "", newUrl)
  }, [state, shareableKeys, pathname, encode])

  const copyShareableUrl = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(getShareableUrl())
      return true
    } catch {
      return false
    }
  }, [getShareableUrl])

  return {
    state,
    setState,
    hasResult,
    setHasResult,
    getShareableUrl,
    updateUrl,
    copyShareableUrl,
  }
}
