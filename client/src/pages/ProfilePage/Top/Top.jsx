import { axiosInstance } from "../../../lib/axios";

import { useState } from "react";

import ProfileCard from "./ProfileCard";

const Top = ({ authUser }) => {
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("profilePic", file);
        try {
            setLoading(true);
            await axiosInstance.patch("/auth/update-profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (err) {
            console.error("Failed to update profile picture:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileCard
            profilePic={authUser?.profilePic}
            fullName={authUser?.fullName}
            designation={authUser?.designation}
            location={authUser?.location}
            onAvatarClick={handleAvatarChange}
            loading={loading}
        />
    );
};

export default Top;