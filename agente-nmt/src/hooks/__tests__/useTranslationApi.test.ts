import { renderHook, act } from '@testing-library/react'
import { useTranslationApi } from '@/hooks/useTranslationApi'
import { apiClient } from '@/lib/api'

jest.mock('@/lib/api', () => ({
  apiClient: {
    getLanguages: jest.fn(),
    translate: jest.fn(),
  },
  handleApiError: jest.fn(),
}))

describe('useTranslationApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTranslationApi())
    expect(result.current.sourceText).toBe('')
    expect(result.current.translatedText).toBe('')
  })
})
