import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import ErrorUI from './pages/my-experiences/components/error/ErrorUI';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/main-layout/MainLayout';
import ReservationList from './pages/reservation-list/ReservationListPage';

import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import DetailPage from './pages/detail/DetailPage';
import MyExperiencesPage from './pages/my-experiences/MyExperiencesPage';
import MyProfilePage from './pages/my-profile/MyProfilePage';
import AddExperiences from './pages/add-edit-experiences/add-experiences/AddExperiences';
import EditExperiences from './pages/add-edit-experiences/edit-experiences/EditExperiences';
import ReservationStatus from './pages/reservation-status/ReservationStatus';
import OAuthKakaoCallback from './pages/oauthkakaocallback/OAuthKakaoCallback';
import LoadingUI from './pages/my-experiences/components/loading/Loading';
import MainPage from './pages/main/MainPage';
import MainLoadingUI from './pages/main/components/loding/MainLodingUI';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: (
          <ErrorBoundary FallbackComponent={ErrorUI}>
            <Suspense fallback={<MainLoadingUI />}>
              <MainPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      { path: '/my-profile', element: <MyProfilePage /> },
      {
        path: 'detail/:id',
        element: (
          <ErrorBoundary FallbackComponent={ErrorUI}>
            <DetailPage />
          </ErrorBoundary>
        ),
      },
      {
        path: '/reservation-list',
        element: <ReservationList />,
      },
      {
        path: '/my-experiences',
        element: (
          <ErrorBoundary FallbackComponent={ErrorUI}>
            <Suspense
              fallback={
                <div>
                  <LoadingUI />
                </div>
              }
            >
              <MyExperiencesPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'add-experiences',
        element: <AddExperiences />,
      },
      {
        path: 'edit-experiences/:id',
        element: <EditExperiences />,
      },
      {
        path: 'reservation-status',
        element: <ReservationStatus />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/oauth/kakao/callback',
    element: <OAuthKakaoCallback />,
  },
]);

export default router;
