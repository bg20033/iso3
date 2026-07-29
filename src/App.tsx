import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Datenschutz from './pages/Datenschutz'
import Home from './pages/Home'
import Impressum from './pages/Impressum'
import Kontakt from './pages/Kontakt'
import LoesungDetail from './pages/LoesungDetail'
import Loesungen from './pages/Loesungen'
import NichtGefunden from './pages/NichtGefunden'
import UeberUns from './pages/UeberUns'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="loesungen" element={<Loesungen />} />
        <Route path="loesungen/:slug" element={<LoesungDetail />} />
        <Route path="produkte" element={<Navigate to="/loesungen" replace />} />
        <Route path="ueber-uns" element={<UeberUns />} />
        <Route path="kontakt" element={<Kontakt />} />
        <Route path="impressum" element={<Impressum />} />
        <Route path="datenschutz" element={<Datenschutz />} />
        <Route path="nicht-gefunden" element={<NichtGefunden />} />
        <Route path="*" element={<NichtGefunden />} />
      </Route>
    </Routes>
  )
}
