import AdminProfile from "../pages/ProfilePage/AdminProfile";
import StudentProfile from "../pages/ProfilePage/StudentProfile";
import AlumniProfile from "../pages/ProfilePage/AlumniProfile";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RoleBasedProfile = () => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();

    if(!authUser) return <navigate to = "/" />;

    const renderProfile = () => {

        switch (authUser.role) {

            case "Admin":
                return <AdminProfile />;

            case "Alumni":
                return <AlumniProfile />;

            case "Student":
                return <StudentProfile />;
            
            default:
                return <p>No Profile available for this role.</p>

        }

    };

    return (
        <div className="p-4">

            {renderProfile()}
            <p> Welcome, {authUser?.fullName} </p>

            <button onClick={async () => { await logout(); navigate("/"); }} className="mt-4 px-4 py-2 bg-danger text-white rounded-lg" >
                Logout
            </button>

        </div>
    );

};

export default RoleBasedProfile;