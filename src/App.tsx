import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Flowers from './pages/Flowers';
import Nature from './pages/Nature';
import Crops from './pages/Crops';
import Upload from './pages/Upload';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flowers" element={<Flowers />} />
            <Route path="/nature" element={<Nature />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;