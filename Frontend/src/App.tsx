import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import Navbar from "./Components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./Components/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden ">
      {/* Backround Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-slate-800 from-green-900" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <LoginPage/> : <Navigate to='/' />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
