import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken, fetchMe, selectAuth } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (!auth.initialized) {
      const storedRefresh = localStorage.getItem('velune_refresh');
      if (storedRefresh) {
        dispatch(refreshToken()).then(r => {
          if (refreshToken.fulfilled.match(r)) dispatch(fetchMe());
        });
      } else {
        // Mark as initialized with no session
        dispatch({ type: 'auth/refresh/rejected' });
      }
    }
  }, [auth.initialized, dispatch]);

  return auth;
}
