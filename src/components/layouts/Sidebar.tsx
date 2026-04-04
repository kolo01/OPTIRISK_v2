import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // ← AJOUTER useLocation
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation(); // ← AJOUTER

  // Vérifier si on est dans l'admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Menu pour les utilisateurs normaux
  const userMenuItems = [
    {
      path: '/dashboard',
      label: 'TABLEAU DE BORD',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/analysis',
      label: 'ANALYSES',
      icon: <BarChart3 size={20} />,
    },
    {
      path: '/rapports-page',
      label: 'RAPPORT',
      icon: <FileText size={20} />,
    },
  ];

  // Menu pour les admins
  const adminMenuItems = [
    {
      path: '/admin/dashboard',
      label: 'TABLEAU DE BORD',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/admin/utilisateurs',
      label: 'UTILISATEURS',
      icon: <Users size={20} />,
    },
    {
      path: '/admin/journal',
      label: 'JOURNAL',
      icon: <Activity size={20} />,
    },
  ];

  // Choisir le menu selon la route
  const menuItems = isAdminRoute ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          bg-gradient-to-b from-blue-900 to-indigo-950 text-white 
          transition-all duration-300
          fixed left-0 top-0 h-full z-50 shadow-xl
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-indigo-700/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-xl font-bold text-white">OP</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold">OptiRisk</h1>
                <p className="text-xs text-blue-300">{isAdminRoute ? 'Admin' : 'Plus'}</p>
              </div>
            )}
          </div>
          
          {/* Bouton fermer mobile */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-3 transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`
              }
            >
              <span className={`${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>


        {/* Collapse button */}
        <div className="p-4 border-t border-indigo-700/30 hidden md:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={20} />
                <span className="ml-2 text-sm">Réduire</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Bouton menu mobile */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-40 bg-blue-900 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <LayoutDashboard size={24} />
      </button>
    </>
  );
};

export default Sidebar;