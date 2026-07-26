import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Desktop from './pages/Desktop.jsx'
import Gacha from './pages/Gacha.jsx'
import Tv from './pages/Tv.jsx'
import Detail from './pages/Detail.jsx'
import Collection from './pages/Collection.jsx'
import Radio from './pages/Radio.jsx'
import Lobby from './pages/Lobby.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/gacha" element={<Gacha />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
