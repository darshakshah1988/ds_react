import {
  configureStore,
  combineReducers,
  getDefaultMiddleware
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// All our reducers
import authReducer, { getDefaultAuthState } from './slices/authSlice';
import layoutReducer, { getDefaultLayoutState } from './slices/layoutSlice';
import artworkReducer, { getDefaultArtworkState } from './slices/artworkSlice';

// Get defaultStates of all the reducer
const getDefaultStates = () => {
  return {
    auth: getDefaultAuthState(),
    layout: getDefaultLayoutState(),
    artwork: getDefaultArtworkState()
  };
};

// The persist config for the artwork Reducer
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
  // whitelist: ['artwork'],
  blacklist: [],
  version: 1
  // migrate for Handling it with a version-controlled store
  // Migrations are applied on your state before replacing your store data in REHYDRATE step.
};

const rootReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  artwork: artworkReducer
});

// A custom function which will return the initializeStore
const initializeStore = (preloadedState?: any) => {
  return configureStore({
    // All reducers of our app
    reducer: persistReducer(persistConfig, rootReducer),
    // Preloaded State
    preloadedState: preloadedState || getDefaultStates(),
    // Middleware
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
    // Show ReduxDevTools
    devTools: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
  });
};

export const store = initializeStore();
export const persistor = persistStore(store);
