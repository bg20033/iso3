import { PageHead } from '../components/PageHead'
import { company } from '../data/site'
import { useLanguage } from '../i18n'

export default function Datenschutz() {
  const { pick } = useLanguage()
  return (
    <>
      <PageHead
        index={pick('Rechtliches', 'Legal')}
        crumb={pick('Datenschutz', 'Privacy')}
        title={pick('Datenschutzhinweis', 'Privacy notice')}
        lead={pick('Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.', 'Information about the processing of personal data on this website.')}
      />
      <section className="section section--light">
        <div className="shell legal prose">
          <h2>{pick('Verantwortliche Stelle', 'Data controller')}</h2>
          <p>
            {company.name}, {company.street}, {company.city}
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <h2>{pick('Kontaktaufnahme', 'Contacting us')}</h2>
          <p>
            {pick('Wenn Sie das Kontaktformular absenden, werden Ihre Angaben und die von Ihnen ausgewählten Anhänge zur Bearbeitung der Projektanfrage per E-Mail an IsoMat übermittelt. Die Website legt daraus kein dauerhaftes Benutzerkonto und keine eigene Dateiablage an.', 'When you submit the contact form, your details and selected attachments are sent to IsoMat by email to process the project enquiry. The website does not create a permanent user account or separate file storage from this data.')}
          </p>
          <p>
            {pick('Zulässig sind bis zu fünf Bild-, PDF- oder CAD-Dateien. Ohne abschliessendes Absenden wird nichts übermittelt. Falls der direkte Versand nicht verfügbar ist, können Sie stattdessen eine vorbereitete E-Mail in Ihrem eigenen E-Mail-Programm öffnen.', 'Up to five image, PDF or CAD files are permitted. Nothing is transmitted unless the form is submitted. If direct sending is unavailable, you can open a prepared email in your own email application instead.')}
          </p>
          <h2>{pick('Technische Zugriffsdaten', 'Technical access data')}</h2>
          <p>
            {pick('Beim Abruf einer Website können durch den Hosting-Anbieter technisch notwendige Zugriffsdaten verarbeitet werden, etwa Zeitpunkt, aufgerufene Ressource, Browsertyp und IP-Adresse. Diese Daten dienen der sicheren Bereitstellung der Website.', 'When a website is accessed, the hosting provider may process technically necessary access data such as time, requested resource, browser type and IP address. This data is used to provide the website securely.')}
          </p>
          <h2>{pick('Cookies und Analyse', 'Cookies and analytics')}</h2>
          <p>
            {pick('Diese Version der Website setzt keine Analyse-, Marketing- oder Profiling-Cookies ein.', 'This version of the website does not use analytics, marketing or profiling cookies.')}
          </p>
          <h2>{pick('Ihre Anfrage', 'Your enquiry')}</h2>
          <p>
            {pick('Fragen zum Datenschutz können Sie an', 'You can send privacy questions to')}{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </div>
      </section>
    </>
  )
}
