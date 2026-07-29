import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('routing', () => {
  it('redirects the old products route to Lösungen', async () => {
    render(
      <MemoryRouter initialEntries={['/produkte']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Dämmkonzepte für komplexe Industrieanlagen.',
      }),
    ).toBeInTheDocument()
  })

  it('renders a solution detail route and the mobile dock labels', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Turbinen' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Schnellnavigation' })).toBeInTheDocument()
  })
})
