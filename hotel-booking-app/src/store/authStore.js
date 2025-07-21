import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setUserProfile: (userProfile) => set({ userProfile }),
  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));

export default useAuthStore;