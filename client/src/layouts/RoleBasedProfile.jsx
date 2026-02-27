import AdminProfile from "../pages/ProfilePage/Profiles/AdminProfile";
import UserProfile from "../pages/ProfilePage/Profiles/UserProfile";

import { useAuthStore } from "../store/useAuthStore";

const RoleBasedProfile = () => {

    const { authUser } = useAuthStore();

    if(!authUser) return <navigate to = "/" />;

    const renderProfile = () => {

        switch (authUser.role) {

            case "Admin":
                return <AdminProfile />;

            case "User":
                return <UserProfile />;
            
            default:
                return <p>No Profile available for this role.</p>

        }

    };

    return (
        <div className="p-4">

            {renderProfile()}

        </div>
    );

};

export default RoleBasedProfile;