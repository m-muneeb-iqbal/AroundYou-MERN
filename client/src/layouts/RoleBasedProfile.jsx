import AdminProfile from "../pages/ProfilePage/AdminProfile";
import StudentProfile from "../pages/ProfilePage/StudentProfile";
import AlumniProfile from "../pages/ProfilePage/AlumniProfile";

import { useAuthStore } from "../store/useAuthStore";

const RoleBasedProfile = () => {

    const { authUser } = useAuthStore();

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

        </div>
    );

};

export default RoleBasedProfile;