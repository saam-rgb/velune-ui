import { createSlice } from '@reduxjs/toolkit';

const THEME_KEY = 'velune_theme';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem(THEME_KEY) || 'dark',
    mobileMenuOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, state.theme);
    },
    setTheme(state, { payload }) {
      state.theme = payload;
      localStorage.setItem(THEME_KEY, payload);
    },
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu(state)  { state.mobileMenuOpen = false; },
  },
});

export const { toggleTheme, setTheme, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;

export const selectTheme          = s => s.ui.theme;
export const selectMobileMenuOpen = s => s.ui.mobileMenuOpen;

export default uiSlice.reducer;
