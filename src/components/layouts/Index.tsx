import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useLocation, Outlet } from 'react-router-dom'; // ✅ ajouter Outlet

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <PrimeReactProvider value={{}}>
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
              <Outlet /> {/* ✅ ici */}
            </div>
          </main>
          
          {!isAdminPage && <Footer />}
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Layout;