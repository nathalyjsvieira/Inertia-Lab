import React, { useState, useEffect } from 'react';

// Importando Componentes Fixos
import Header from './components/Header';
import Footer from './components/Footer';

// Importando Telas
import Home from './pages/Home';
import Links from './pages/Links';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  // 1. Lê a memória do navegador ao carregar a página (Evita o F5 quebrar a tela)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('paginaAtual') || 'home';
  });

  // 2. Salva a tela atual na memória sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('paginaAtual', currentPage);
  }, [currentPage]);

  // Rola para o topo quando a página muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Paleta de cores global
  const colors = {
    primaryBlue: '#112A46',
    primaryGreen: '#539845',
    secBlue: '#5C99C6',
    secGray: '#9E9E9E'
  };

  // Função central de navegação
  const handleNavigation = (action, isHash = true) => {
    if (isHash) {
      if (currentPage !== 'home') setCurrentPage('home');
      setTimeout(() => {
        document.querySelector(action)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentPage(action);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#539845] selection:text-white flex flex-col">

      {/* Esconde o Header normal se estiver no Dashboard */}
      {currentPage !== 'dashboard' && (
        <Header
          colors={colors}
          handleNavigation={handleNavigation}
          currentPage={currentPage}
        />
      )}

      {/* ÁREA PRINCIPAL DA PÁGINA */}
      {/* Remove o padding do topo (pt-20) se for o Dashboard para usar a tela cheia */}
      <main className={`flex-grow ${currentPage !== 'dashboard' ? 'pt-20' : ''}`}>
        {currentPage === 'home' && <Home colors={colors} handleNavigation={handleNavigation} />}
        {currentPage === 'links' && <Links colors={colors} />}
        {currentPage === 'login' && <Login colors={colors} handleNavigation={handleNavigation} />}

        {/* Nova Tela do Dashboard! */}
        {currentPage === 'dashboard' && <Dashboard colors={colors} handleNavigation={handleNavigation} />}
      </main>

      {/* Esconde o Footer normal se estiver no Dashboard */}
      {currentPage !== 'dashboard' && (
        <Footer
          colors={colors}
          handleNavigation={handleNavigation}
        />
      )}

    </div>
  );
}