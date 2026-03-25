import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import AdminRoute from "./components/admin/AdminRoute";
import AdminPage from "./pages/AdminPage/AdminPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";

import { Loader } from "lucide-react";
import { useCallStore } from "./store/useCallStore.js";
import CallNotification from "./components/call/CallNotification.jsx";
import CallModal from "./components/call/CallModal.jsx";

export const App = () => {

    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
    const { initializeCallSocket } = useCallStore();

    useEffect (() => {
        checkAuth()
    }, [checkAuth]);

    useEffect(() => {
        if (!authUser) return;
        const cleanup = initializeCallSocket();
        return cleanup;
    }, [authUser, initializeCallSocket]);

    console.log({ authUser });

    if (isCheckingAuth && !authUser) return (

        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
    )

    return (

        <div className="page-enter">

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<LandingPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/login" element={!authUser ? <LandingPage /> : <Navigate to="/home" />} />
                <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/home" />} />
                <Route path="/reset-password" element={!authUser ? <ResetPasswordPage /> : <Navigate to="/home" />} />
                <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/" />} />
                <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/" />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/" />} />
            </Routes>

            {authUser && (
                <>
                    <CallNotification />
                    <CallModal />
                </>
            )}
            
        </div>
    );
}

export default App;