# Inhalte zur Prüfung mit der Fertigung

Diese Liste sammelt alle Aussagen auf der Website, die **nicht** aus dem
IsoMat-Material stammen, sondern beim Aufbau der Seite formuliert wurden. Sie
klingen plausibel, sind aber nie mit der Fertigung abgeglichen worden.

Vorgehen: Spalte „Stimmt so?" durchgehen und je Punkt **ja / anpassen /
streichen** vermerken. Änderungen trage ich anschliessend ein – die Fundstelle
im Code steht jeweils dabei.

---

## A · Sichtbar auf der Website

Diese Texte sind **live** und werden von Besuchern und Suchmaschinen gelesen.
Sie haben deshalb Vorrang.

### A1 · „15+ Jahre Erfahrung"

| | |
|---|---|
| **Wo** | Startseite, Kennzahlenleiste unter dem Titelbild · zusätzlich in der Suchmaschinen-Beschreibung der Seite „Über uns" |
| **Aussage** | „Erfahrung: 15+ Jahre" bzw. „über 15 Jahre Erfahrung in der industriellen Isolierung" |
| **Code** | `src/pages/Home.tsx` (Block `landing-proof`) · `src/seo.ts` (Route `/ueber-uns`) |
| **Stimmt so?** | |

Wenn die Zahl nicht belegbar ist, besser durch das Gründungsjahr ersetzen
(„seit 20XX") – das lässt sich prüfen und altert nicht.

### A2 · Allgemeine Fragen (FAQ auf der Startseite)

Fünf Antworten, alle mit konkreten Zusagen zum Vorgehen. Fundstelle:
`src/data/site.ts`, Block `generalFaqs`. Sie erscheinen zusätzlich als
strukturierte Daten für Suchmaschinen, werden also unter Umständen direkt in
den Suchergebnissen zitiert.

| Nr. | Frage | Zu prüfende Aussage | Stimmt so? |
|---|---|---|---|
| 1 | Wie oft lässt sich ein Dämmkissen abnehmen und wieder montieren? | „für den wiederkehrenden Einsatz konstruiert"; Zyklenzahl bewusst offen gelassen | |
| 2 | Was braucht IsoMat für eine Offerte? | Fotos + Hauptabmessungen + Betriebstemperatur genügen; CAD willkommen, aber keine Voraussetzung; „oft genügt ein Aufmass vor Ort" | |
| 3 | Werden Antriebe, Sensoren und Anschlüsse ausgespart? | „Ja" – Aussparungen werden **in der Konstruktion** festgelegt und **nicht nachträglich** ins fertige Kissen geschnitten | |
| 4 | Kann bestehende Dämmung ersetzt werden, ohne die Anlage abzustellen? | „In vielen Fällen ja"; Aufmass an der laufenden Anlage, Montage in kurzem Zeitfenster | |
| 5 | Wie werden die Kissen nach der Demontage wieder zugeordnet? | „Jedes Element wird gekennzeichnet" | |

Frage 3 und 5 sind die heikelsten: Sie versprechen ein festes Verfahren
(„nicht nachträglich geschnitten", „jedes Element gekennzeichnet"). Wenn das
nicht ausnahmslos gilt, sollte die Formulierung weicher werden.

### A3 · Fragen auf jeder Produktseite

Drei Fragen, die für alle sieben Kategorien automatisch erzeugt werden.
Fundstelle: `src/data/site.ts`, Funktion `makeSolution`.

| Nr. | Frage | Zu prüfende Aussage | Stimmt so? |
|---|---|---|---|
| 1 | Sind die Dämmkissen für … abnehmbar? | „Ja" – demontierbar für Wartung, Inspektion und Reparatur, danach wieder passgenau montierbar | |
| 2 | Wie wird die passende Form bestimmt? | Fertigung nach Zeichnung, Modell **oder** Aufmass an der Anlage; Aussparungen und Befestigungen sind Teil der Konstruktion | |
| 3 | Welche Angaben helfen bei einer Projektanfrage? | Fotos, Abmessungen, Betriebstemperatur, Wartungszugang | |

Weil dieselbe Antwort für Ventile wie für Turbinen gilt, muss sie für **jede**
Kategorie zutreffen. Falls eine Kategorie aus der Reihe fällt (z. B. andere
Befestigung bei Kompensatoren), lohnt eine eigene Antwort dort.

---

## B · Zurzeit nicht sichtbar (geparkt)

Diese beiden Blöcke stehen noch im Code, werden aber **nirgends angezeigt** –
die Bauteile, die sie dargestellt haben, sind beim Redesign entfallen. Sie
landen auch nicht mehr im ausgelieferten Programmcode. Vor einer
Wiederverwendung prüfen; sonst können sie ersatzlos weg.

### B1 · Aufbau des Dämmkissens (`jacketLayers`)

Vier Schichten, bewusst ohne Materialnamen formuliert:

| Nr. | Schicht | Beschreibung | Stimmt so? |
|---|---|---|---|
| 01 | Aussenhülle | „Mechanisch belastbares Gewebe" gegen Abrieb, Feuchtigkeit, Betriebsmedien | |
| 02 | Dämmkern | „Temperaturbeständiges Vlies" in passender Stärke; bestimmt Dämmwirkung und Aufbaudicke | |
| 03 | Innenhülle | Liegt direkt am heissen Bauteil an, hält den Kern in Form | |
| 04 | Verschlüsse & Steppung | Spannverschlüsse und durchgesteppte Kreuzpunkte fixieren die Segmente | |

Offen: Welche Materialien werden tatsächlich verwendet, und dürfen sie
öffentlich genannt werden? Konkrete Bezeichnungen wirken deutlich
glaubwürdiger als „temperaturbeständiges Vlies".

### B2 · Einsatzfelder (`industries`)

Sechs Branchen, aus den Referenzaufnahmen abgeleitet – **nicht** aus einer
Kundenliste:

| Nr. | Branche | Genannte Komponenten | Bedient IsoMat das? |
|---|---|---|---|
| 01 | Energie & Fernwärme | Turbinen, Verteiler, Pumpen | |
| 02 | Verbrennung & Biomasse | Kessel, Trichter, Zellenradschleusen | |
| 03 | Chemie & Prozesstechnik | Ventile, Flansche, Wärmetauscher | |
| 04 | Lebensmittel & Getränke | Rohrleitungen, Behälter, Armaturen | |
| 05 | Gebäudetechnik | Pumpen, Verteiler, Kompensatoren | |
| 06 | Anlagen- & Sonderbau | Ventilatoren, Baugruppen, Sonderbauteile | |

Besonders zu klären: **Lebensmittel & Getränke** – dieser Bereich hat eigene
Hygiene- und Reinigungsanforderungen. Wenn IsoMat dort keine Referenzen hat,
sollte die Branche raus.

---

## C · Was bereits belegt ist

Nicht auf dieser Liste stehen: Firmenangaben (Adresse, Telefon, E-Mail), die
Kategorietexte der sieben Lösungen und sämtliche Referenzaufnahmen. Diese
stammen aus dem IsoMat-Material bzw. dem Bildarchiv.

Die Vorher/Nachher-Vergleiche zeigen reale Aufnahmen derselben Komponente in
beiden Zuständen – die Bildunterschriften nennen bewusst keine Nennweiten oder
Temperaturen, weil diese Angaben nicht dokumentiert sind. Falls die Daten
vorliegen, machen sie die Vergleiche aussagekräftiger.
