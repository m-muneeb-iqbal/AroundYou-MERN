import { useState, useEffect } from "react";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

import DrawerHeader from "./drawer/DrawerHeader";
import DrawerTabs from "./drawer/DrawerTabs";
import EditInfoTab from "./drawer/EditInfoTab";
import DangerZoneTab from "./drawer/DangerZoneTab";

const UserDrawer = ({ onClose }) => {

    const { authUser } = useAuthStore();
    const isSuperAdmin = authUser?.isSuperAdmin;

    const [activeTab, setActiveTab] = useState("edit");
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [form, setForm] = useState({ fullName: "", email: "", location: "", designation: "", description: "", role: "User" });
    const [edu, setEdu] = useState({ education: "", field: "", institute: "", passingYear: "", cgpa: "", certificate: "", provider: "" });
    const [exp, setExp] = useState({ company: "", jobTitle: "", joiningDate: "", currentlyWorking: false });
    const [skillsInput, setSkillsInput] = useState("");

    const { selectedUser, updateUser, deleteUser, removeProfilePic, clearEducation, clearExperience, clearSkills, clearFriends } = useAdminStore();

    useEffect(() => {
        if (!selectedUser) return;
        setForm({ fullName: selectedUser.fullName || "", email: selectedUser.email || "", location: selectedUser.location || "", designation: selectedUser.designation || "", description: selectedUser.description || "", role: selectedUser.role || "User" });
        setEdu({ education: selectedUser.education || "", field: selectedUser.field || "", institute: selectedUser.institute || "", passingYear: selectedUser.passingYear || "", cgpa: selectedUser.cgpa || "", certificate: selectedUser.certificate || "", provider: selectedUser.provider || "" });
        setExp({ company: selectedUser.company || "", jobTitle: selectedUser.jobTitle || "", joiningDate: selectedUser.joiningDate?.slice(0, 10) || "", currentlyWorking: selectedUser.currentlyWorking || false });
        setSkillsInput((selectedUser.skills || []).join(", "));
    }, [selectedUser]);

    if (!selectedUser) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
            await updateUser(selectedUser._id, { ...form, ...edu, ...exp, skills });
        } finally {
            setSaving(false);
        }
    };

    const handleAction = async (action) => {
        const actions = { profilePic: removeProfilePic, education: clearEducation, experience: clearExperience, skills: clearSkills, friends: clearFriends };
        if (action === "deleteUser") { await deleteUser(selectedUser._id); onClose(); return; }
        await actions[action]?.(selectedUser._id);
        setConfirm(null);
    };

    return (

        <>
        
            <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }} />
            <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "420px", backgroundColor: "white", zIndex: 1050, boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                
                <DrawerHeader user={selectedUser} onClose={onClose} />
                <DrawerTabs activeTab={activeTab} onChange={setActiveTab} />
                {activeTab === "edit" && (

                    <EditInfoTab
                        form={form} edu={edu} exp={exp} skillsInput={skillsInput}
                        isSuperAdmin={isSuperAdmin} saving={saving}
                        onFormChange={setForm} onEduChange={setEdu}
                        onExpChange={setExp} onSkillsChange={setSkillsInput}
                        onSave={handleSave}
                    />
                )}

                {activeTab === "danger" && (

                    <DangerZoneTab
                        isSuperAdmin={isSuperAdmin}
                        confirm={confirm}
                        onConfirm={setConfirm}
                        onCancel={() => setConfirm(null)}
                        onAction={handleAction}
                    />

                )}

            </div>

        </>

    );

};

export default UserDrawer;