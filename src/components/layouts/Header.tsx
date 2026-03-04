import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Search,
  LogOut,
  Settings,
  HelpCircle,
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

  // Récupérer l'utilisateur (exemple)
  const user = JSON.parse(localStorage.getItem('optirisk_user') || '{}')

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

  // Notifications d'exemple
  const notificationList = [
    { id: 1, title: 'Nouvelle analyse disponible', time: 'Il y a 2 minutes', unread: true },
    { id: 2, title: 'Rapport mensuel généré', time: 'Il y a 1 heure', unread: true },
    { id: 3, title: 'Mise à jour des risques', time: 'Il y a 3 heures', unread: false },
    { id: 4, title: 'Tâche échéante demain', time: 'Il y a 5 heures', unread: false },
  ];

  const unreadCount = notificationList.filter(n => n.unread).length;

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
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotifications(!notifications);
                  setUserDropdown(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {notifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationList.length > 0 ? (
                      notificationList.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            // Marquer comme lu
                            setNotifications(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">Aucune notification</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifications(false)}
                      className="text-sm text-blue-600 hover:text-blue-800 text-center block"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Settings - Hidden on mobile */}
            <Link
              to="/parametres"
              className="hidden md:block p-2 rounded-full hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </Link>

            {/* Help - Hidden on mobile */}
            <Link
              to="/aide"
              className="hidden md:block p-2 rounded-full hover:bg-gray-100"
            >
              <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </Link>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setUserDropdown(!userDropdown);
                  setNotifications(false);
                }}
                className="flex items-center space-x-2 md:space-x-3 p-1 md:p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm md:text-base">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
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
                    
                    <Link
                      to="/parametres"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Paramètres
                    </Link>

                    <Link
                      to="/aide"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                    >
                      <HelpCircle className="h-4 w-4 mr-3" />
                      Aide
                    </Link>
                    
                    <Link
                      to="/notifications"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
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
            <Link
              to="/parametres"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-600" />
              Paramètres
            </Link>
            <Link
              to="/aide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <HelpCircle className="h-5 w-5 mr-3 text-gray-600" />
              Aide
            </Link>
            <Link
              to="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 mr-3 text-gray-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;