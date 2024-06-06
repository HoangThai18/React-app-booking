// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const userName = 'trainingfe';
  const [userPassword, setUserPassword] = useState('aurora');

  return <UserContext.Provider value={{ userName, userPassword, setUserPassword }}>{children}</UserContext.Provider>;
};
