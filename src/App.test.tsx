import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { BeforeAfterSlider } from './components/BeforeAfterSlider'

describe('routing and redesigned experience', () => {
  it('shows all seven categories in one landing-page explorer', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Wärme im System. Zugang im Service.',
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(7)
    expect(screen.getByRole('tab', { name: /Ventile/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(
      screen.getByRole('button', { name: 'Kissen abnehmen' }),
    ).toBeInTheDocument()
  })

  it('switches the landing explorer without adding another control set', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    fireEvent.click(await screen.findByRole('tab', { name: /Turbinen/ }))
    expect(screen.getByRole('tab', { name: /Turbinen/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('heading', { name: 'Turbinen' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Kissen abnehmen' })).toHaveLength(1)
    expect(
      screen.getByRole('link', { name: /Details & Referenzen/ }),
    ).toHaveAttribute('href', '/produkte/turbinen')
  })

  it('renders a focused product page with only its matching model', async () => {
    render(
      <MemoryRouter initialEntries={['/produkte/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Turbinen' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Kissen abnehmen' }),
    ).toBeInTheDocument()
    expect(
      screen
        .getAllByRole('link', { name: /Projekt anfragen/ })
        .find((link) => link.getAttribute('href')?.includes('application=Turbinen')),
    ).toHaveAttribute('href', '/kontakt?application=Turbinen')
  })

  it('redirects a legacy solution URL to its product page', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Turbinen' }),
    ).toBeInTheDocument()
  })

  it('keeps the solutions index static and opens category details in a modal', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Die passende Form für jede Anlage.',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Kissen abnehmen' })).not.toBeInTheDocument()
    const modalTriggers = screen.getAllByRole('button', {
      name: /: Details öffnen$/,
    })
    expect(modalTriggers).toHaveLength(7)

    fireEvent.click(modalTriggers[0])
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByRole('heading', {
        level: 2,
        name: 'Ventile & Armaturen',
      }),
    ).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prefills the contact form from a validated project URL', async () => {
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

  // Der Vergleich steht nicht mehr auf der Startseite, sondern im
  // Kategorie-Fokus. Geprüft wird deshalb die Tastaturbedienung selbst.
  it('supports keyboard controls for the before-and-after comparison', () => {
    const image = (label: string) => ({
      src: `/media/ventile/before-after/ventil-${label}-1280.webp`,
      thumb: `/media/ventile/before-after/ventil-${label}-640.webp`,
      alt: label,
    })

    render(
      <BeforeAfterSlider before={image('vorher')} after={image('nachher')} />,
    )

    const slider = screen.getByRole('slider', {
      name: 'Vergleich zwischen Vorher und Nachher',
    })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveValue('55')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveValue('0')
  })

  it('runs the before-and-after strip on the landing page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const strip = await screen.findByLabelText('Vorher und nachher im Vergleich')
    expect(within(strip).getAllByText('Vorher').length).toBeGreaterThan(0)
    expect(within(strip).getAllByText('Nachher').length).toBeGreaterThan(0)
  })

  it('closes the mobile menu with Escape and returns focus', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const menuButton = await screen.findByRole('button', { name: 'Menü öffnen' })
    fireEvent.click(menuButton)
    expect(screen.getByRole('navigation', { name: 'Mobile Navigation' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument()
    expect(menuButton).toHaveFocus()
  })
})
