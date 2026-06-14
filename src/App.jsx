import Board from "./pages/Boards/_id";
import { Route ,Routes, Navigate ,Outlet  } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
import {useSelector} from 'react-redux'
import { selectUserData } from "~/redux/user/userSlice";
import NotFound from "./pages/404/NotFound";
 
const ProtectedRoutes = ({user}) =>{
    if(!user) return <Navigate to="/login" replace={true} />;
    return <Outlet />;
}

function App() {
  const userData = useSelector(selectUserData);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards/69a858057ac4cb4c68b3213b" replace={true} />} />
      <Route element={<ProtectedRoutes user={userData} />} >
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>
      {/* authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
