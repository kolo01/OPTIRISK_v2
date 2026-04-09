import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { authService } from '../../services/authService';

const Header: React.FC = () => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Récupérer l'utilisateur et écouter les mises à jour d'avatar
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('optirisk_user') || '{}'));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleAvatarUpdate = (e: CustomEvent) => {
      setAvatarUrl(e.detail.url);
    };
    window.addEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener);
  }, []);

  // Fermer les dropdowns en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };



  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button & Title */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-800">OptiRisk</h1>
            </div>
          </div>

         

          {/* Search bar - Centered on mobile, right on desktop */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Right side - Icons & User */}
          <div className="flex items-center space-x-2 md:space-x-4">            

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setUserDropdown(!userDropdown);
                  setNotifications(false);
                }}
                className="flex items-center space-x-2 md:space-x-3 p-1 md:p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm md:text-base overflow-hidden">
                  {(avatarUrl || user.avatar) ? (
                    <img
                      src={avatarUrl || user.avatar}
                      alt="Avatar"
                      className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover"
                    />
                  ) : (
                    user.first_name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                
                <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500 hidden md:block" />
              </button>

              {/* Dropdown menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profil"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mon profil
                    </Link>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <div className="space-y-2">
            <Link
              to="/profil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <User className="h-5 w-5 mr-3 text-gray-600" />
              Mon profil
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;