import Board from './pages/Boards/_id';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import AccountVerification from './pages/Auth/AccountVerification';
import ResetPassWord from './pages/Auth/ResetPassWord';
import { useSelector } from 'react-redux';
import { selectUserData } from '~/redux/user/userSlice';
import NotFound from './pages/404/NotFound';
import SettingsPage from './pages/Settings/Setting';
import BoardsPage from './pages/Boards/index';

const ProtectedRoutes = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet />;
};

function App() {
  const userData = useSelector(selectUserData);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards" replace={true} />
        }
      />
      <Route element={<ProtectedRoutes user={userData} />}>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>
      {/* authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassWord />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/settings/profile" element={<SettingsPage />} />
      <Route path="/settings/change-password" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
