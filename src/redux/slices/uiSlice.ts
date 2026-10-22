import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light';
type Vertical = 'LD' | 'IE' | 'RE' | 'VC';

interface UiState {
  theme: Theme;
  activeVertical: Vertical;
  searchQuery: string;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    activeVertical: 'LD',
    searchQuery: '',
  } satisfies UiState,
  reducers: {
    setTheme(_state, _action: PayloadAction<Theme>) {
      // Theme is always light
    },
    setActiveVertical(state, action: PayloadAction<Vertical>) {
      state.activeVertical = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setTheme, setActiveVertical, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
