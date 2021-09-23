import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

// Default State for the Auth reducer
export const getDefaultAuthState = () => {
  return {
    user: null
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getDefaultAuthState(),
  reducers: {
    setUser: (state: Draft<any>, action: PayloadAction<any>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based on those changes
      // state.user.id = action.payload.id;
      state.user = action.payload.user;
    },
    resetUser: (state: Draft<any>) => {
      state.step = null;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = authSlice.actions;

// Selectors:
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: { auth: { user: any } }) => state.auth.user;

export default authSlice.reducer;
