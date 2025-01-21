import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuItems } from '@/config/menu-items';

type HeaderNavContextType = {
  currentMenu: string;
  setCurrentMenu: (menu: string) => void;
};

const HeaderNavContext = createContext<HeaderNavContextType>({
  currentMenu: 'dashboard',
  setCurrentMenu: () => {}
});

export const useHeaderNav = () => useContext(HeaderNavContext);

export const HeaderNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentMenu, setCurrentMenu] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    // Function to determine the current menu based on path
    const determineCurrentMenu = (pathname: string) => {
      // Check if the current path matches any administration submenu paths
      const isAdminPath = ['/areas', '/aplicacoes'].some((path) =>
        pathname.startsWith(path)
      );

      if (isAdminPath || pathname === '/administracao') {
        return 'administracao';
      }

      // Default to dashboard for other paths
      return 'dashboard';
    };

    const newMenu = determineCurrentMenu(location.pathname);
    setCurrentMenu(newMenu);
  }, [location.pathname]);

  return (
    <HeaderNavContext.Provider value={{ currentMenu, setCurrentMenu }}>
      {children}
    </HeaderNavContext.Provider>
  );
};
