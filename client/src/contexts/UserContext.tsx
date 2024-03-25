import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  user_Role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const initialUserContext: UserContextType = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(initialUserContext);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUserContext.user);

  const setUserContext = (user: User | null) => {
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
