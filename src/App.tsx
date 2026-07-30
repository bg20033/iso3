import { useEffect } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { Layout } from './components/Layout'
import { solutionBySlug, solutionQuickviewPath } from './data/site'
import Datenschutz from './pages/Datenschutz'
import Home from './pages/Home'
import Impressum from './pages/Impressum'
import Kontakt from './pages/Kontakt'
import LoesungDetail from './pages/LoesungDetail'
import Loesungen from './pages/Loesungen'
import NichtGefunden from './pages/NichtGefunden'
import UeberUns from './pages/UeberUns'

function LegacySolutionRedirect() {
  const { slug } = useParams()
  const solution = solutionBySlug(slug)
  return (
    <Navigate
      to={solution ? solutionQuickviewPath(solution) : '/nicht-gefunden'}
      replace
    />
  )
}

function ProductQuickviewRedirect() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const solution = solutionBySlug(slug)

  useEffect(() => {
    navigate(
      solution ? solutionQuickviewPath(solution) : '/nicht-gefunden',
      { replace: true },
    )
  }, [navigate, solution])

  return <LoesungDetail />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="loesungen" element={<Loesungen />} />
        <Route path="loesungen/:slug" element={<LegacySolutionRedirect />} />
        <Route path="produkte" element={<Navigate to="/loesungen" replace />} />
        <Route path="produkte/:slug" element={<ProductQuickviewRedirect />} />
        <Route
          path="sonderbau"
          element={<Navigate to="/produkte/sonderbau" replace />}
        />
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
