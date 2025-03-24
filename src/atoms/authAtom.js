import { atom } from 'jotai';

// Read from localStorage on init
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

export const userAtom = atom(storedUser);

// Atom to update user and sync with localStorage
export const userAtomWithPersistence = atom(
  (get) => get(userAtom),
  (get, set, newUser) => {
    set(userAtom, newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }
);
