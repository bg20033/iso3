import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
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
      <MemoryRouter initialEntries={['/produkte/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Turbinen' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Schnellnavigation' })).toBeInTheDocument()
  })

  it('prefills the contact form from a validated quick brief URL', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/kontakt?application=Turbinen&priority=Wartungszugang&temperature=320%20%C2%B0C',
        ]}
      >
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByLabelText('Anwendung *')).toHaveValue('Turbinen')
    expect(screen.getByLabelText('Priorität')).toHaveValue('Wartungszugang')
    expect(screen.getByLabelText('Betriebstemperatur')).toHaveValue('320 °C')
  })

  it('keeps capability cards, sidebar items and CTAs keyboard accessible', async () => {
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    const cardLink = await screen.findByRole('link', {
      name: 'Ventile & Armaturen öffnen',
    })
    cardLink.focus()
    expect(cardLink).toHaveFocus()

    const cta = screen.getByRole('link', { name: 'Projekt anfragen' })
    cta.focus()
    expect(cta).toHaveFocus()

    fireEvent.keyDown(
      screen.getByRole('button', { name: '06 Turbinen' }),
      { key: 'Enter' },
    )
    expect(scrollSpy).toHaveBeenCalled()
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Dämmkonzepte für komplexe Industrieanlagen.',
      }),
    ).toBeInTheDocument()
  })

  it('redirects a legacy solution URL to its canonical product page', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Turbinen' }),
    ).toBeInTheDocument()
  })
})
