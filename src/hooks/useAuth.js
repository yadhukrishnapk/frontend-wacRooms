import { useAtom } from 'jotai';
import { userAtomWithPersistence } from '../atoms/authAtom';

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtomWithPersistence);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
};
