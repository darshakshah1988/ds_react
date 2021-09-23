import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

// Default State for the layout reducer
export const getDefaultLayoutState = () => {
  return {
    authFormOverlay: false
  };
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: getDefaultLayoutState(),
  reducers: {
    showAuthFormOverlay: (state: Draft<any>, action: PayloadAction<any>) => {
      state.authFormOverlay = action.payload.authFormOverlay;
    }
  }
});

// Reducers and actions
export const { showAuthFormOverlay } = layoutSlice.actions;

// Selectors
export const getAuthFormOverlay = (state: {
  layout: { authFormOverlay: boolean };
}) => state.layout.authFormOverlay;

export default layoutSlice.reducer;
