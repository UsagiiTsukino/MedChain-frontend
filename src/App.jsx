import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import LayoutClient from './components/client/layout.client';
import NotFound from './components/share/not.found';
import DashboardPage from './pages/admin/dashboard';
import RegisterPage from './pages/auth/register';
import LoginPage from './pages/auth/login';
import LayoutAdmin from './components/admin/layout.admin';
import { fetchAccount } from './redux/slice/accountSlide';
import ProtectedAdminRoute from './components/share/protected-route';
import ProtectedStaffRoute from './components/share/protected-route/staff-protected';
import VaccinePage from './pages/admin/vaccine';
import CenterPage from './pages/admin/center';
import UserPage from './pages/admin/user';
import ProfilePage from './pages/auth/profile';
import ProtectedUserRoute from './components/share/protected-route/user-protected';
import PermissionPage from './pages/admin/permission';
import RolePage from './pages/admin/role';
import AppointmentManagementPage from './pages/admin/appointment';

import SuccessPage from './pages/client/success';
import HomePage from './pages/client/home';
import MarketPage from './pages/client/market';
import BookingPage from './pages/client/booking';
import CertificatePage from './pages/auth/certificate/[id]';

// Staff pages
import LayoutStaff from './components/staff/layout.staff';
import StaffDashboard from './pages/staff/dashboard';
import StaffVaccinePage from './pages/staff/vaccines';
import StaffCenterPage from './pages/staff/centers';
import MySchedulePage from './pages/staff/my-schedule';
import AppointmentPage from './pages/staff/appointment';
import BookingMangaer from './pages/admin/booking';
import VaccineRAGSystem from './pages/client/recommend';
import CartPage from './pages/client/cart';
import Checkout from './pages/client/checkout';
import Profile from './pages/auth';
import CalendarStaff from './pages/staff/calendar';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch, isAuthenticated]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutClient />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'market', element: <MarketPage /> },
        {
          path: 'cart',
          element: <CartPage />,
        },
        { path: 'booking', element: <BookingPage /> },
        { path: 'success', element: <SuccessPage /> },
        { path: 'demo', element: <VaccineRAGSystem /> },
        { path: 'checkout', element: <Checkout /> },
        {
          path: 'profile',
          element: (
            <ProtectedUserRoute>
              <ProfilePage />
            </ProtectedUserRoute>
          ),
        },
        {
          path: 'profile_test',
          element: (
            <ProtectedUserRoute>
              <Profile />
            </ProtectedUserRoute>
          ),
        },
      ],
    },

    {
      path: '/admin',
      element: (
        <ProtectedAdminRoute>
          <LayoutAdmin />
        </ProtectedAdminRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'vaccines',
          element: <VaccinePage />,
        },
        {
          path: 'bookings',
          element: <BookingMangaer />,
        },
        {
          path: 'users',
          element: <UserPage />,
        },
        {
          path: 'centers',
          element: <CenterPage />,
        },
        {
          path: 'permissions',
          element: <PermissionPage />,
        },
        {
          path: 'roles',
          element: <RolePage />,
        },
        {
          path: 'appointments',
          element: <AppointmentManagementPage />,
        },
      ],
    },

    // Staff route - only accessible by DOCTOR and CASHIER roles
    {
      path: '/staff',
      element: (
        <ProtectedStaffRoute>
          <LayoutStaff />
        </ProtectedStaffRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          path: 'dashboard',
          element: <StaffDashboard />,
        },
        {
          path: 'vaccines',
          element: <StaffVaccinePage />,
        },
        {
          path: 'centers',
          element: <StaffCenterPage />,
        },
        {
          path: 'appointments',
          element: <AppointmentPage />,
        },
        {
          path: 'calendar-view',
          element: <CalendarStaff />,
        },
        {
          path: 'my-schedule',
          element: <MySchedulePage />,
        },
      ],
    },

    {
      path: '/auth/certificate/:id',
      element: <CertificatePage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },

    {
      path: '/register',
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
