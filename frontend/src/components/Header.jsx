import React, { useState } from 'react';
import { LogIn, Menu, X } from 'lucide-react';

export default function Header({ colors, handleNavigation, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função intermediária para fechar o menu ao clicar em um link
  const onNavClick = (action, isHash = true) => {
    setIsMenuOpen(false);
    handleNavigation(action, isHash);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavClick('home', false)}
          >
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('home')}>
              {/* A tag img busca direto da pasta public automaticamente */}
              <img
                src="/logo-navbar.png"
                alt="Inertia Labs Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavClick('#sobre')}
              className="text-sm font-medium hover:text-[#539845] transition-colors"
              style={{ color: colors.primaryBlue }}
            >
              A Iniciativa
            </button>
            <button
              onClick={() => onNavClick('#projeto')}
              className="text-sm font-medium hover:text-[#539845] transition-colors"
              style={{ color: colors.primaryBlue }}
            >
              Projeto: Motores
            </button>
            <button
              onClick={() => onNavClick('links', false)}
              className={`text-sm font-bold transition-colors ${currentPage === 'links' ? 'border-b-2 border-[#539845]' : 'hover:text-[#539845]'}`}
              style={{ color: currentPage === 'links' ? colors.primaryGreen : colors.primaryBlue }}
            >
              Links & Docs
            </button>
          </nav>

          {/* CTA Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavClick('login', false)}
              className="flex items-center px-4 py-2 rounded-full font-bold transition-all hover:bg-gray-100"
              style={{ color: colors.primaryBlue }}
            >
              <LogIn size={18} className="mr-2" /> Acessar Sistema
            </button>
            <button
              onClick={() => onNavClick('#contato')}
              className="px-6 py-2 rounded-full text-white font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: colors.primaryGreen }}
            >
              Fale Conosco
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: colors.primaryBlue }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg pb-4">
          <div className="px-4 pt-4 pb-3 space-y-3">
            <button onClick={() => onNavClick('#sobre')} className="block w-full text-left font-medium" style={{ color: colors.primaryBlue }}>A Iniciativa</button>
            <button onClick={() => onNavClick('#projeto')} className="block w-full text-left font-medium" style={{ color: colors.primaryBlue }}>Projeto: Motores</button>
            <button onClick={() => onNavClick('links', false)} className="block w-full text-left font-bold" style={{ color: colors.primaryGreen }}>Links & Docs</button>
            <hr />
            <button onClick={() => onNavClick('login', false)} className="block w-full text-left font-bold flex items-center" style={{ color: colors.primaryBlue }}>
              <LogIn size={18} className="mr-2" /> Acessar Dashboard
            </button>
            <button onClick={() => onNavClick('#contato')} className="block w-full text-center py-3 rounded-lg text-white font-bold" style={{ backgroundColor: colors.primaryGreen }}>
              Fale Conosco
            </button>
          </div>
        </div>
      )}
    </header>
  );
}