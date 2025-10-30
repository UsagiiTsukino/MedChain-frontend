import { Outlet, useLocation } from 'react-router-dom';

import Loading from '../share/loading';
import { useEffect, useState } from 'react';
import Navbar from './header.client';
import Footer from './footer.client';

const LayoutClient = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

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
