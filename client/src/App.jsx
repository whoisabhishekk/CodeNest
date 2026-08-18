import { useEffect, useState } from "react";
import { Routes, Route } from  "react-router";
import { useDispatch } from "react-redux";
import axiosClient from "./utils/axiosClient";
import { setUser, clearUser } from "./authSlice";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemSolver from "./pages/ProblemSolver";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import PremiumPage from "./pages/PremiumPage";

function App() {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // App start hote hi check karo kya user pehle se logged in hai (cookie se)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosClient.get("/user/check");
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        dispatch(clearUser());
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  // Jab tak auth check ho raha hai, loader dikhao taaki ProtectedRoute galti se bahar na fek de
  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-lowest, #0e0e0e)',
      }}>
        <div className="dm-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (  
    <div style={{ minHeight: '100vh', background: 'var(--surface-lowest, #0e0e0e)' }}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        
        {/* Protected Routes (Sirf login hone ke baad dikhenge) */}
        <Route path="/problem/:id" element={
          <ProtectedRoute>
            <ProblemSolver />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
export default App;