import { useState, useEffect, useMemo } from "react";
import { Offcanvas } from "react-bootstrap";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

import { useFormDirty } from "../../hooks/useFormDirty";

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
    const [originalData, setOriginalData] = useState(null);

    const { selectedUser, updateUser, deleteUser, removeProfilePic, clearEducation, clearExperience, clearSkills, clearFriends } = useAdminStore();

    useEffect(() => {

        if (!selectedUser) return;

        const populated = {
            fullName: selectedUser.fullName || "",
            email: selectedUser.email || "",
            location: selectedUser.location || "",
            designation: selectedUser.designation || "",
            description: selectedUser.description || "",
            role: selectedUser.role || "User",
            education: selectedUser.education || "",
            field: selectedUser.field || "",
            institute: selectedUser.institute || "",
            passingYear: selectedUser.passingYear || "",
            cgpa: selectedUser.cgpa || "",
            certificate: selectedUser.certificate || "",
            provider: selectedUser.provider || "",
            company: selectedUser.company || "",
            jobTitle: selectedUser.jobTitle || "",
            joiningDate: selectedUser.joiningDate?.slice(0, 10) || "",
            currentlyWorking: selectedUser.currentlyWorking || false,
            skills: (selectedUser.skills || []).join(", "),
        };

        // Set both form states and original snapshot
        setForm({
            fullName: populated.fullName, email: populated.email,
            location: populated.location, designation: populated.designation,
            description: populated.description, role: populated.role,
        });
        setEdu({
            education: populated.education, field: populated.field,
            institute: populated.institute, passingYear: populated.passingYear,
            cgpa: populated.cgpa, certificate: populated.certificate,
            provider: populated.provider,
        });
        setExp({
            company: populated.company, jobTitle: populated.jobTitle,
            joiningDate: populated.joiningDate, currentlyWorking: populated.currentlyWorking,
        });
        setSkillsInput(populated.skills);
        setOriginalData(populated);

    }, [selectedUser]);

    const currentData = useMemo(() => ({
        ...form, ...edu, ...exp, skills: skillsInput,
    }), [form, edu, exp, skillsInput]);

    const isChanged = useFormDirty(originalData, currentData);

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
            setOriginalData(currentData);

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
        
            <Offcanvas
            show={!!selectedUser}
            onHide={onClose}
            placement="end"
            backdrop={true}
            style={{ width: "420px" }}
        >
            <Offcanvas.Header style={{ borderBottom: "1px solid #f0f0f0", padding: "12px 16px" }}>
                <DrawerHeader user={selectedUser} onClose={onClose} />
            </Offcanvas.Header>

            <Offcanvas.Body className="p-0 d-flex flex-column">
                <DrawerTabs activeTab={activeTab} onChange={setActiveTab} />
                {activeTab === "edit" && (
                    <EditInfoTab
                        form={form} edu={edu} exp={exp} skillsInput={skillsInput}
                        isSuperAdmin={isSuperAdmin} saving={saving}
                        isChanged={isChanged}
                        onFormChange={setForm} onEduChange={setEdu}
                        onExpChange={setExp} onSkillsChange={setSkillsInput}
                        onSave={handleSave}
                    />
                )}
                {activeTab === "danger" && (
                    <DangerZoneTab
                        isSuperAdmin={isSuperAdmin} confirm={confirm}
                        onConfirm={setConfirm} onCancel={() => setConfirm(null)}
                        onAction={handleAction}
                    />
                )}
            </Offcanvas.Body>
        </Offcanvas>

        </>

    );

};

export default UserDrawer;