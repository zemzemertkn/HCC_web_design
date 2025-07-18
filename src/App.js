// Gerekli kütüphaneleri ve oluşturduğumuz sayfaları import ediyoruz
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Bu satırları değiştirin
import InputPage from './components/InputPage'; 
import TahminSonuc from './components/TahminSonuc';
import './App.css'; // Genel stil dosyanız

function App() {
  return (
    // Router, tüm uygulamanın sayfa yönlendirmelerini yönetir
    <Router>
      <div className="App">
        {/* Routes, farklı yollar (path) arasında geçiş yapmamızı sağlar */}
        <Routes>
          {/* Ana yol ("/"), InputPage komponentini gösterecek */}
          <Route path="/" element={<InputPage />} />

          {/* "/sonuc" yolu, TahminSonuc komponentini gösterecek */}
          <Route path="/sonuc" element={<TahminSonuc />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;