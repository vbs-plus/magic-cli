import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Home from '@/pages/home'
import Hi from '@/pages/hi'
import NotFound from '@/pages/404'

export default function App() {
  return (
    <main className="font-sans px-4 py-10 text-center text-gray-700 dark:text-gray-200">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/hi/:name" element={<Hi />}></Route>
          <Route path="/*" element={ <NotFound/>}></Route>
        </Routes>
      </Router>
      <Footer />
    </main>
  )
}
