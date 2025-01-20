import React, { createContext, useContext, useState } from 'react';

type HeaderNavContextType = {
  currentMenu: string;
  setCurrentMenu: (menu: string) => void;
};

const HeaderNavContext = createContext<HeaderNavContextType>({
  currentMenu: 'dashboard1',
  setCurrentMenu: () => {}
});

export const useHeaderNav = () => useContext(HeaderNavContext);

export const HeaderNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentMenu, setCurrentMenu] = useState('dashboard1');

  return (
    <HeaderNavContext.Provider value={{ currentMenu, setCurrentMenu }}>
      {children}
    </HeaderNavContext.Provider>
  );
};
