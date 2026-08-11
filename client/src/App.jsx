// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemSlover from './pages/ProblemSolver';

function App() {
  return (

    <BrowserRouter>
      <Navbar />
        <div className="pt-16"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem/:id" element={<ProblemSlover/>}></Route>
            <Route path="/login" element={<div className="text-center mt-10 text-xl text-white">Login Page (Coming Soon)</div>} />
          </Routes>
        </div>
    </BrowserRouter>
  )
}

export default App;
