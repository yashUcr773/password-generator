import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePasswordGenerator } from '../src/hooks/usePasswordGenerator'

// Mock window.crypto for testing
const mockCrypto = {
  getRandomValues: (array: Uint32Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 4294967296)
    }
    return array
  }
}

Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
  writable: true
})

describe('usePasswordGenerator', () => {
  let hook: ReturnType<typeof renderHook<ReturnType<typeof usePasswordGenerator>, any>>

  beforeEach(() => {
    hook = renderHook(() => usePasswordGenerator())
  })

  it('should initialize with default options', () => {
    const { result } = hook

    expect(result.current.options).toEqual({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      customSymbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    })
  })

  it('should generate a password of correct length', () => {
    const { result } = hook

    act(() => {
      result.current.generatePassword()
    })

    expect(result.current.password).toHaveLength(16)
  })

  it('should update options correctly', () => {
    const { result } = hook

    act(() => {
      result.current.updateOptions({ length: 20, includeSymbols: false })
    })

    expect(result.current.options.length).toBe(20)
    expect(result.current.options.includeSymbols).toBe(false)
  })

  it('should generate password with correct character types', () => {
    const { result } = hook

    act(() => {
      result.current.updateOptions({
        includeUppercase: true,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
      })
      result.current.generatePassword()
    })

    const password = result.current.password
    expect(password).toMatch(/^[A-Z]+$/)
  })

  it('should calculate password strength correctly', () => {
    const { result } = hook

    act(() => {
      result.current.generatePassword()
    })

    const strength = result.current.getPasswordStrength()
    expect(strength).toBeGreaterThan(0)
    expect(strength).toBeLessThanOrEqual(100)
  })

  it('should throw error when no character types are selected', () => {
    const { result } = hook

    act(() => {
      result.current.updateOptions({
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
      })
    })

    expect(() => {
      act(() => {
        result.current.generatePassword()
      })
    }).toThrow('At least one character type must be selected')
  })

  it('should exclude similar characters when option is enabled', () => {
    const { result } = hook

    act(() => {
      result.current.updateOptions({
        excludeSimilar: true,
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        length: 50, // Longer password to increase chance of similar chars
      })
      result.current.generatePassword()
    })

    const password = result.current.password
    const similarChars = 'il1Lo0O'
    
    for (const char of similarChars) {
      expect(password).not.toContain(char)
    }
  })
})
