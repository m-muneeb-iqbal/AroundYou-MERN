import AdminProfile from "../pages/ProfilePage/Profiles/AdminProfile";
import UserProfile from "../pages/ProfilePage/Profiles/UserProfile";

import { useAuthStore } from "../store/useAuthStore";

const RoleBasedProfile = () => {

    const { authUser } = useAuthStore();

    if(!authUser) return <navigate to = "/" />;

    const renderProfile = () => {

        if (authUser.isAdmin) return <AdminProfile />;
        return <UserProfile />;

    };

    return (
        <>

            {renderProfile()}

        </>
    );

};

export default RoleBasedProfile;