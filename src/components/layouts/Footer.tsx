import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold">OptiRisk Plus</h2>
                <p className="text-sm text-gray-400">Gestion des risques intelligente</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Plateforme avancée d'analyse et de gestion des risques pour les organisations modernes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link to="/analyse" className="text-gray-400 hover:text-white text-sm">
                  Analyse des risques
                </Link>
              </li>
              <li>
                <Link to="/rapport" className="text-gray-400 hover:text-white text-sm">
                  Rapports
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-white text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400 text-sm">www.optirisk-plus.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400 text-sm">optirisk.infos@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400 text-sm">+225 07 68 773-028</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} OptiRisk Plus. Tous droits réservés.
            </p>
        
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;