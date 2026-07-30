import { fireEvent, render, screen } from '@testing-library/react'
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
        name: 'Dämmkissen für Ventile & Armaturen.',
      }),
    ).toBeInTheDocument()
  })

  it('redirects a product detail URL to the full quickview modal', async () => {
    render(
      <MemoryRouter initialEntries={['/produkte/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('dialog', { name: 'Turbinen' }),
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

  it('shows only the Ventile focus and keeps its controls keyboard accessible', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    const moreButton = await screen.findByRole('button', {
      name: 'Mehr erfahren: Ventile & Armaturen',
    })
    moreButton.focus()
    expect(moreButton).toHaveFocus()
    expect(
      screen.queryByRole('button', { name: /Turbinen/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Kompensatoren/ }),
    ).not.toBeInTheDocument()

    const cta = screen.getByRole('link', { name: 'Projekt anfragen' })
    cta.focus()
    expect(cta).toHaveFocus()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Dämmkissen für Ventile & Armaturen.',
      }),
    ).toBeInTheDocument()
  })

  it('supports mouse, touch-native range input and keyboard comparison controls', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    const slider = await screen.findByRole('slider', {
      name: 'Vergleich zwischen Vorher und Nachher',
    })

    expect(slider).toHaveValue('50')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveValue('55')
    fireEvent.change(slider, { target: { value: '72' } })
    expect(slider).toHaveValue('72')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveValue('0')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveValue('100')
  })

  it('opens a solution quickview modal and closes it with Escape', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    const moreButton = await screen.findByRole('button', {
      name: 'Mehr erfahren: Ventile & Armaturen',
    })
    moreButton.focus()
    fireEvent.click(moreButton)

    const dialog = screen.getByRole('dialog', {
      name: 'Ventile & Armaturen',
    })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Häufige Fragen' })).toBeInTheDocument()
    expect(screen.getByText(/reale Aufnahmen aus dem IsoMat-Archiv/)).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Details & Referenzen' }),
    ).not.toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(moreButton).toHaveFocus()
  })

  it('redirects a legacy solution URL to its full quickview modal', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('dialog', { name: 'Turbinen' }),
    ).toBeInTheDocument()
  })

  it('opens the full Kompensatoren content directly from the query URL', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen?solution=kompensatoren']}>
        <App />
      </MemoryRouter>,
    )

    const dialog = await screen.findByRole('dialog', {
      name: 'Kompensatoren',
    })
    expect(dialog).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Einblicke: Kompensatoren' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Häufige Fragen' })).toBeInTheDocument()
  })
})
