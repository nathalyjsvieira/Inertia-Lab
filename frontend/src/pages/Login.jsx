import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ colors, handleNavigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação de autenticação
    if (email === 'admin@inertialabs.com' && senha === '1234') {
      handleNavigation('dashboard', false);
    } else {
      setErro('Credenciais inválidas.');
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-50">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#112A46] to-transparent opacity-10 transform skew-x-12 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#539845] rounded-full blur-3xl opacity-10 -translate-x-20 translate-y-20"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl mb-4 bg-blue-50" style={{ color: colors.primaryBlue }}>
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-extrabold" style={{ color: colors.primaryBlue }}>Acesso Restrito</h2>
          <p className="text-gray-500 mt-2">Plataforma de Monitoramento Preditivo</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center text-sm font-bold">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" /> {erro}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112A46]" placeholder="seu@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-gray-400" /></div>
              <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112A46]" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center items-center py-4 rounded-lg text-white font-bold text-lg transition-transform hover:scale-[1.02] shadow-lg mt-6" style={{ backgroundColor: colors.primaryBlue }}>
            Entrar no Dashboard <ArrowRight size={20} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}