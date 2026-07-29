import { PageHead } from '../components/PageHead'
import { company } from '../data/site'

export default function Datenschutz() {
  return (
    <>
      <PageHead
        index="Rechtliches"
        crumb="Datenschutz"
        title="Datenschutzhinweis"
        lead="Informationen zur Verarbeitung personenbezogener Daten auf dieser Website."
      />
      <section className="section section--light">
        <div className="shell legal prose">
          <h2>Verantwortliche Stelle</h2>
          <p>
            {company.name}, {company.street}, {company.city}
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <h2>Kontaktaufnahme</h2>
          <p>
            Das Kontaktformular übermittelt keine Daten an einen Webserver. Es
            erstellt auf Ihrem Gerät eine vorbereitete E-Mail, die erst über Ihr
            E-Mail-Programm versendet wird. Für die weitere Bearbeitung gelten
            die Datenschutzbestimmungen Ihres E-Mail-Anbieters.
          </p>
          <h2>Technische Zugriffsdaten</h2>
          <p>
            Beim Abruf einer Website können durch den Hosting-Anbieter technisch
            notwendige Zugriffsdaten verarbeitet werden, etwa Zeitpunkt,
            aufgerufene Ressource, Browsertyp und IP-Adresse. Diese Daten dienen
            der sicheren Bereitstellung der Website.
          </p>
          <h2>Cookies und Analyse</h2>
          <p>
            Diese Version der Website setzt keine Analyse-, Marketing- oder
            Profiling-Cookies ein.
          </p>
          <h2>Ihre Anfrage</h2>
          <p>
            Fragen zum Datenschutz können Sie an{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a> richten.
          </p>
        </div>
      </section>
    </>
  )
}
