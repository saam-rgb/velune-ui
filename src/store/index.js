import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import articlesReducer from './slices/articlesSlice';
import uiReducer from './slices/uiSlice';
import { injectStore } from '../services/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    ui: uiReducer,
  },
  middleware: getDefault => getDefault({ serializableCheck: false }),
});

// Break the circular dep: api.js references _store via this setter, not the module
injectStore(store);

export default store;
