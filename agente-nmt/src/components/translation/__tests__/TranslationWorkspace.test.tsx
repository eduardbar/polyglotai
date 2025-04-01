import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranslationWorkspace } from '@/components/translation/TranslationWorkspace'

// Mock D3 to avoid ESM issues in Jest
jest.mock('d3', () => ({
  select: () => ({ selectAll: () => ({ remove: () => ({}) }), append: () => ({ attr: () => ({ attr: () => ({ attr: () => ({ attr: () => ({ transition: () => ({ duration: () => ({ ease: () => ({}) }) }) }) }) }) }) }) }),
  arc: () => () => ({}),
  easeElastic: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  SwapHorizontal: () => null,
  Copy: () => null,
  Check: () => null,
}))

// Mock UI Select
jest.mock('@/components/ui/Select', () => ({
  Select: (props: any) => {
    const { label, error, options = [], ...rest } = props
    return (
      <select aria-label={label || 'select'} {...rest}>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    )
  },
}))

// Mock TextAreaPanel
jest.mock('@/components/translation/TextAreaPanel', () => ({
  TextAreaPanel: (props: any) => {
    const { value, onChange, placeholder, readOnly, label } = props
    return (
      <div>
        {label ? <label>{label}</label> : null}
        <textarea
          placeholder={placeholder}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
    )
  },
}))

// Mock del hook
jest.mock('@/hooks/useTranslationApi', () => ({
  useTranslationApi: () => ({
    sourceText: '',
    translatedText: '',
    isLoading: false,
    error: null,
    confidenceScore: null,
    sourceLanguage: 'en',
    targetLanguage: 'es',
    languages: [
      { id: 1, code: 'en', name: 'English', isLowResource: false },
      { id: 2, code: 'es', name: 'Español', isLowResource: false },
    ],
    setSourceText: jest.fn(),
    setSourceLanguage: jest.fn(),
    setTargetLanguage: jest.fn(),
    swapLanguages: jest.fn(),
    handleTranslate: jest.fn(),
    loadLanguages: jest.fn(),
    clearError: jest.fn(),
  }),
}))

// Mock de Button evitando props no válidos al DOM
jest.mock('@/components/ui/Button', () => ({
  Button: (props: any) => {
    const { children, onClick, loading, variant, size, ...rest } = props
    return (
      <button onClick={onClick} {...rest}>
        {children}
      </button>
    )
  },
}))

jest.mock('@/components/analytics/ConfidenceGauge', () => ({
  ConfidenceGauge: (props: any) => {
    const { score } = props
    return (
      <div data-testid="confidence-gauge">
        Confidence: {score ? `${Math.round(score * 100)}%` : 'No data'}
      </div>
    )
  },
}))

describe('TranslationWorkspace Component', () => {
  it('renders workspace elements', () => {
    render(<TranslationWorkspace />)
    // Selectors
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1)
    // Textareas
    expect(screen.getByPlaceholderText('Ingresa el texto que quieres traducir...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('La traducción aparecerá aquí...')).toBeInTheDocument()
    // Button
    expect(screen.getByRole('button', { name: /Traducir/i })).toBeInTheDocument()
  })
})
