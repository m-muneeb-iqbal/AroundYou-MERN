import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";

import { SkeletonTheme } from "react-loading-skeleton";
import HomePageSkeleton from "./components/layout/HomePageSkeleton";
import ProfilePageSkeleton from "./components/layout/ProfilePageSkeleton.jsx";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import AdminRoute from "./components/admin/AdminRoute";
import AdminPage from "./pages/AdminPage/AdminPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";

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

    if (isCheckingAuth) {
        const path = window.location.pathname;
        if (path === "/profile") return <ProfilePageSkeleton />;
        if (path === "/") return <HomePageSkeleton />;
        return null;
    }

    return (

        <SkeletonTheme>

            <div className="page-enter">

                <Routes>
                    <Route path="/home" element={!authUser ? <LandingPage /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!authUser ? <LandingPage /> : <Navigate to="/" />} />
                    <Route path="/verify-email" element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!authUser ? <LandingPage /> : <Navigate to="/" />} />
                    <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
                    <Route path="/reset-password" element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />} />
                    <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/home" />} />
                    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/home" />} />
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/home" />} />
                </Routes>

                {authUser && (
                    <>
                        <CallNotification />
                        <CallModal />
                    </>
                )}
                
            </div>

        </SkeletonTheme>

    );
}

export default App;