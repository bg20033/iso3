import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { BeforeAfterSlider } from './components/BeforeAfterSlider'
import { comparisons } from './data/site'

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

  /*
   * Kein Paar darf mehrfach im Streifen stehen, nur um ihn zu füllen. Die
   * Kopie, die den Lauf nahtlos schliesst, ist inert und zählt deshalb nicht
   * in die Bedienreihenfolge.
   */
  it('never repeats a comparison pair to fill the strip', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const strip = await screen.findByLabelText('Vorher und nachher im Vergleich')
    expect(within(strip).getAllByRole('slider')).toHaveLength(comparisons.length)
  })

  it('opens a photo in a zoom layer instead of a new page', async () => {
    render(
      <MemoryRouter initialEntries={['/produkte/turbinen']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { level: 1, name: 'Turbinen' })
    const triggers = screen.getAllByRole('button', { name: /vergrössern$/ })
    expect(triggers.length).toBeGreaterThan(0)
    /* Kein target="_blank" mehr – die Aufnahme bleibt im Seitenkontext. */
    expect(screen.queryByRole('link', { name: /vergrössern$/ })).toBeNull()

    fireEvent.click(triggers[0])
    const zoom = screen.getByRole('dialog', { name: /vergrösserte Ansicht$/ })
    expect(
      within(zoom).getByRole('button', { name: 'Bild vergrössern' }),
    ).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(
      screen.queryByRole('dialog', { name: /vergrösserte Ansicht$/ }),
    ).toBeNull()
  })

  it('keeps the category modal open while the zoom layer is closed', async () => {
    render(
      <MemoryRouter initialEntries={['/loesungen']}>
        <App />
      </MemoryRouter>,
    )

    const modalTriggers = await screen.findAllByRole('button', {
      name: /: Details öffnen$/,
    })
    fireEvent.click(modalTriggers[0])
    const modal = screen.getByRole('dialog', { name: /Ventile & Armaturen/ })

    fireEvent.click(within(modal).getAllByRole('button', { name: /vergrössern$/ })[0])
    expect(
      screen.getByRole('dialog', { name: /vergrösserte Ansicht$/ }),
    ).toBeInTheDocument()

    /* Escape schliesst nur die oberste Ebene. */
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(
      screen.queryByRole('dialog', { name: /vergrösserte Ansicht$/ }),
    ).toBeNull()
    expect(
      screen.getByRole('dialog', { name: /Ventile & Armaturen/ }),
    ).toBeInTheDocument()
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
