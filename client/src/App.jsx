import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import AdminRoute from "./components/admin/AdminRoute";
import AdminPage from "./pages/AdminPage/AdminPage";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";

import { Loader } from "lucide-react";

export const App = () => {

    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

    useEffect (() => {
        checkAuth()
    }, [checkAuth]);

    console.log({ authUser });

    if (isCheckingAuth && !authUser) return (

        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
    )

    return (

        <div>

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<LandingPage />} />
                <Route path="/login" element={!authUser ? <LandingPage /> : <Navigate to="/home" />} />
                <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/" />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/" />} />
            </Routes>
            
        </div>
    );
}

export default App;