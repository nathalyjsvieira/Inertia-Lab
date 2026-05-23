import React from 'react';
import { Github, Brain, FileText, BookOpen, ExternalLink } from 'lucide-react';

export default function Links({ colors }) {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: colors.primaryBlue }}>
            Links & <span style={{ color: colors.primaryGreen }}>Referências</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acesse toda a documentação, bases de dados e repositórios acadêmicos do projeto de Análise Acústica Preditiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Repositório GitHub (Edge Computing)',
              desc: 'Código fonte embarcado para captura e FFT em tempo real (C++ / Python).',
              icon: <Github size={32} />,
              color: colors.primaryBlue,
              tag: 'Código'
            },
            {
              title: 'Modelos de Machine Learning',
              desc: 'Jupyter Notebooks e datasets de treinamento de falhas sonoras.',
              icon: <Brain size={32} />,
              color: colors.secBlue,
              tag: 'IA / Dados'
            },
            {
              title: 'Artigo Científico (Draft)',
              desc: 'Documento acadêmico descrevendo a metodologia e resultados preliminares.',
              icon: <FileText size={32} />,
              color: colors.primaryGreen,
              tag: 'PDF'
            },
            {
              title: 'Mapa de identidade visual do projeto',
              desc: 'Documento descrevendo a escolha de elementos visuais para a marca do projeto.',
              icon: <FileText size={32} />,
              color: colors.primaryBlue,
              tag: 'PDF'
            },
            {
              title: 'Documentação da API',
              desc: 'Endpoints para integração do dashboard de monitoramento industrial.',
              icon: <BookOpen size={32} />,
              color: colors.secBlue,
              tag: 'Docs'
            }
          ].map((link, i) => (
            <a
              key={i}
              href="#"
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-opacity-10" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                    {link.icon}
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">
                    {link.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.primaryBlue }}>{link.title}</h3>
                <p className="text-gray-600 mb-6">{link.desc}</p>
              </div>
              <div className="flex items-center text-sm font-bold" style={{ color: link.color }}>
                Acessar material <ExternalLink size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}