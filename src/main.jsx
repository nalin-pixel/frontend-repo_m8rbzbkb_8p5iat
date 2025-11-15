import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useOutletContext } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Turfs from './pages/Turfs'
import Contact from './pages/Contact'
import Test from './Test'
import './index.css'

function HomeWithCtx(){
  const ctx = useOutletContext()
  return <Home {...ctx} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element={<HomeWithCtx />} />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)