import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loading from '../share/loading';
import { useEffect, useState } from 'react';
import Navbar from './header.client';
import Footer from './footer.client';
import { useGlobalSocket } from '../../hooks/useGlobalSocket';

const LayoutClient = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.account.user);

  // Connect to global socket for notifications
  useGlobalSocket(user);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      {location.pathname !== '/success' && <Footer />}
    </>
  );
};

export default LayoutClient;
