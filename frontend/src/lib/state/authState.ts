import { User } from 'firebase/auth'
import { create } from 'zustand'

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}))

export default useAuthStore;