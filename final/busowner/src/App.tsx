import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { Logout_User, setUserInfo } from './store/slices/authSlice';
import { request } from './services/api/client';
import FullPageLoader from './components/common/FullPageLoader';
import AppRoutes from './routes';
import { AuthApiResponse } from './types/auth';

export const App: React.FC = () => {
  const [load, setLoad] = useState(false);
  const userinfo = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();

  const loadUser = async () => {
    if (!userinfo?.auth) return;
    try {
      setLoad(true);
      const response = await request<AuthApiResponse>('Adminpanel/logInByToken', {
        method: 'POST',
      });
      if (response?.statusCode !== 200) {
        dispatch(Logout_User());
        toast.warn('Session expired. Please log in again.');
      } else if (response?.statusCode === 200) {
        dispatch(setUserInfo(response.data));
      }
    } catch (e: any) {
      toast.warn(e.message || 'Verification failed. Session cleared.');
      dispatch(Logout_User());
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (userinfo?.auth) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (load) {
    return <FullPageLoader open={true} />;
  }

  return (
    <Router>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

export default App;
