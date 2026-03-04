import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import { useLocation } from 'react-router-dom'; // AJOUTER

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation(); // AJOUTER

  // Vérifier si on est sur une page admin
  const isAdminPage = location.pathname.startsWith('/admin'); // AJOUTER

  return (
    <PrimeReactProvider value={{  }}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        
        <div className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20 ml-0' : 'md:ml-64 ml-0'
        }`}>
          <Header />
          
          <main className="flex-1 p-4 md:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
          
          {/* Footer caché sur les pages admin */}
          {!isAdminPage && <Footer />} {/* MODIFICATION ICI */}
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Layout;