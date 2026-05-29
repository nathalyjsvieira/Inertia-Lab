import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer({ colors, handleNavigation }) {
  return (
    <footer className="py-12 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left cursor-pointer" onClick={() => handleNavigation('home', false)}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('home')}>
              {/* A tag img busca direto da pasta public automaticamente */}
              <img
                src="/logo-navbar.png"
                alt="Inertia Labs Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm" style={{ color: colors.secGray }}>
              Engenharia da Computação / 5° Sem. - 2026
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#112A46] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#112A46] transition-colors">
              <span className="sr-only">GitHub</span>
              <Github size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#112A46] transition-colors">
              <span className="sr-only">Email</span>
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 Inertia Labs. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 space-x-4 text-sm text-gray-500">
            <button onClick={() => handleNavigation('links', false)} className="hover:underline">Documentação</button>
            <button onClick={() => handleNavigation('login', false)} className="hover:underline">Acesso Restrito</button>
          </div>
        </div>
      </div>
    </footer>
  );
}