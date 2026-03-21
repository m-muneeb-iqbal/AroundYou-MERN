/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Form, Button, Spinner, Badge } from "react-bootstrap";

import { X, UserRoundMinus, BookOpen, Briefcase, Wrench, ImageOff } from "lucide-react";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

import InitialsAvatar from "../common/InitialsAvatar";

const SectionHeader = ({ label }) => (

    <div className="fw-bold mb-2 pb-1" style={{ fontSize: "0.78rem", color: "#898C8F", borderBottom: "1px solid #f0f0f0", textTransform: "uppercase", letterSpacing: "0.05em" }} >

        {label}
        
    </div>
);

const DangerButton = ({ icon: Icon, label, onClick, confirming, onConfirm, onCancel }) => (

    <div className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: "1px solid #F5F5F5" }}>

        <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "#04263D" }}>

            <Icon size={15} color="#dc3545" />
            {label}

        </div>

        {confirming ? (

            <div className="d-flex gap-1">

                <Button size="sm" variant="danger" style={{ fontSize: "0.7rem", padding: "2px 8px" }} onClick={onConfirm}>
                    Confirm
                </Button>
                <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.7rem", padding: "2px 8px" }} onClick={onCancel}>
                    Cancel
                </Button>

            </div>

        ) : (

            <Button size="sm" variant="outline-danger" style={{ fontSize: "0.7rem" }} onClick={onClick}>
                Remove
            </Button>

        )}

    </div>

);

const roleBadgeStyle = (role) => {

    if (role === "SuperAdmin") return { backgroundColor: "#6F42C1", color: "#FFFFFF" };
    if (role === "Admin") return { backgroundColor: "#04263D", color: "#FFFFFF" };
    return { backgroundColor: "#E0E0E0", color: "#555555" };

};

const UserDrawer = ({ onClose }) => {

    const { authUser } = useAuthStore();
    const isSuperAdmin = authUser?.isSuperAdmin;

    const [activeTab, setActiveTab] = useState("edit");
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState(null);

    const {
        selectedUser,
        updateUser,
        deleteUser,
        removeProfilePic,
        clearEducation,
        clearExperience,
        clearSkills,
        clearFriends,
    } = useAdminStore();

    const [form, setForm] = useState({
        fullName: "", email: "", location: "", designation: "",
        description: "", role: "User",
    });

    const [edu, setEdu] = useState({
        education: "", field: "", institute: "", passingYear: "", cgpa: "",
        certificate: "", provider: "",
    });

    const [exp, setExp] = useState({
        company: "", jobTitle: "", joiningDate: "", currentlyWorking: false,
    });

    const [skillsInput, setSkillsInput] = useState("");

    useEffect(() => {

        if (!selectedUser) return;

        setForm({
            fullName: selectedUser.fullName || "",
            email: selectedUser.email || "",
            location: selectedUser.location || "",
            designation: selectedUser.designation || "",
            description: selectedUser.description || "",
            role: selectedUser.role || "User",
        });

        setEdu({
            education: selectedUser.education || "",
            field: selectedUser.field || "",
            institute: selectedUser.institute || "",
            passingYear: selectedUser.passingYear || "",
            cgpa: selectedUser.cgpa || "",
            certificate: selectedUser.certificate || "",
            provider: selectedUser.provider || "",
        });

        setExp({
            company: selectedUser.company || "",
            jobTitle: selectedUser.jobTitle || "",
            joiningDate: selectedUser.joiningDate?.slice(0, 10) || "",
            currentlyWorking: selectedUser.currentlyWorking || false,
        });

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

    const handleDanger = async (action) => {

        switch (action) {

            case "profilePic": await removeProfilePic(selectedUser._id); break;
            case "education":  await clearEducation(selectedUser._id); break;
            case "experience": await clearExperience(selectedUser._id); break;
            case "skills":     await clearSkills(selectedUser._id); break;
            case "friends":    await clearFriends(selectedUser._id); break;
            case "deleteUser":
                await deleteUser(selectedUser._id);
                onClose();
                return;
        }

        setConfirm(null);

    };

    return (

        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }} />

            <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "420px", backgroundColor: "white", zIndex: 1050, boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", overflowY: "auto" }}>

                {/* Header */}
                <div className="d-flex align-items-center gap-3 p-3" style={{ borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>

                    <InitialsAvatar name={selectedUser.fullName} profilePic={selectedUser.profilePic} size={42} />
                    <div className="flex-grow-1 overflow-hidden">

                        <div className="fw-bold text-truncate" style={{ color: "#04263D" }}>{selectedUser.fullName}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: "0.78rem" }}>{selectedUser.email}</div>

                    </div>

                    <Badge pill bg="none" style={{ ...roleBadgeStyle(selectedUser.role), fontSize: "0.65rem", flexShrink: 0 }}>
                        {selectedUser.role}
                    </Badge>

                    <X role="button" size={20} color="#898C8F" onClick={onClose} />

                </div>

                {/* Tabs */}
                <div className="d-flex" style={{ borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>

                    {["edit", "danger"].map((tab) => (

                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, border: "none",
                                borderBottom: activeTab === tab ? "2px solid #04263D" : "2px solid transparent",
                                background: "none", padding: "10px", fontSize: "0.85rem",
                                fontWeight: activeTab === tab ? "bold" : "normal",
                                color: activeTab === tab ? "#04263D" : "#898C8F",
                                cursor: "pointer",
                            }}
                        >
                            {tab === "edit" ? "Edit Info" : "Danger Zone"}

                        </button>

                    ))}

                </div>

                {/* Edit tab */}
                {activeTab === "edit" && (

                    <div className="p-3 d-flex flex-column gap-3">

                        <SectionHeader label="Personal" />
                        <div className="d-flex flex-column gap-2">

                            {[

                                { key: "fullName", label: "Full Name" },
                                { key: "email", label: "Email" },
                                { key: "location", label: "Location" },
                                { key: "designation", label: "Designation" },

                            ].map(({ key, label }) => (

                                <Form.Group key={key}>
                                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>{label}</Form.Label>
                                    <Form.Control size="sm" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }} />
                                </Form.Group>

                            ))}

                            <Form.Group>
                                <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} size="sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0", resize: "none" }} />
                            </Form.Group>

                            {/* Role field — SuperAdmin only, cannot assign SuperAdmin */}
                            {isSuperAdmin && (

                                <Form.Group>

                                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>Role</Form.Label>
                                    <Form.Select size="sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }}>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </Form.Select>

                                </Form.Group>

                            )}

                        </div>

                        <SectionHeader label="Education" />
                        <div className="d-flex flex-column gap-2">

                            {[

                                { key: "education", label: "Level" },
                                { key: "field", label: "Field" },
                                { key: "institute", label: "Institute" },
                                { key: "passingYear", label: "Passing Year" },
                                { key: "cgpa", label: "CGPA" },
                                { key: "certificate", label: "Certificate" },
                                { key: "provider", label: "Provider" },

                            ].map(({ key, label }) => (

                                <Form.Group key={key}>
                                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>{label}</Form.Label>
                                    <Form.Control size="sm" value={edu[key]} onChange={(e) => setEdu({ ...edu, [key]: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }} />
                                </Form.Group>

                            ))}

                        </div>

                        <SectionHeader label="Experience" />
                        <div className="d-flex flex-column gap-2">

                            {[

                                { key: "company", label: "Company" },
                                { key: "jobTitle", label: "Job Title" },
                                { key: "joiningDate", label: "Joining Date", type: "date" },

                            ].map(({ key, label, type = "text" }) => (

                                <Form.Group key={key}>
                                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>{label}</Form.Label>
                                    <Form.Control size="sm" type={type} value={exp[key]} onChange={(e) => setExp({ ...exp, [key]: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }} />
                                </Form.Group>

                            ))}

                            <Form.Check type="checkbox" label="Currently working here" checked={exp.currentlyWorking} onChange={(e) => setExp({ ...exp, currentlyWorking: e.target.checked })} style={{ fontSize: "0.85rem" }} />

                        </div>

                        <SectionHeader label="Skills" />
                        <Form.Group>
                            <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>Comma separated</Form.Label>
                            <Form.Control size="sm" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="e.g. React, Node.js, MongoDB" style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }} />
                        </Form.Group>

                        <Button onClick={handleSave} disabled={saving} style={{ backgroundColor: "#04263D", border: "none", fontSize: "0.85rem" }}>
                            {saving ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                        </Button>

                    </div>
                )}

                {/* Danger zone tab */}
                {activeTab === "danger" && (

                    <div className="p-3 d-flex flex-column gap-1">

                        {/* Available to both Admin and SuperAdmin */}
                        <DangerButton icon={ImageOff} label="Remove profile picture" confirming={confirm === "profilePic"} onClick={() => setConfirm("profilePic")} onConfirm={() => handleDanger("profilePic")} onCancel={() => setConfirm(null)} />
                        <DangerButton icon={BookOpen} label="Clear education" confirming={confirm === "education"} onClick={() => setConfirm("education")} onConfirm={() => handleDanger("education")} onCancel={() => setConfirm(null)} />
                        <DangerButton icon={Briefcase} label="Clear experience" confirming={confirm === "experience"} onClick={() => setConfirm("experience")} onConfirm={() => handleDanger("experience")} onCancel={() => setConfirm(null)} />
                        <DangerButton icon={Wrench} label="Clear skills" confirming={confirm === "skills"} onClick={() => setConfirm("skills")} onConfirm={() => handleDanger("skills")} onCancel={() => setConfirm(null)} />

                        {/* SuperAdmin only */}
                        {isSuperAdmin && (

                            <>
                                <DangerButton icon={UserRoundMinus} label="Remove all friendships" confirming={confirm === "friends"} onClick={() => setConfirm("friends")} onConfirm={() => handleDanger("friends")} onCancel={() => setConfirm(null)} />

                                <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#FFF5F5", border: "1px solid #F8D7DA" }}>

                                    <div className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: "#dc3545" }}>Delete User</div>
                                    <div className="text-muted mb-2" style={{ fontSize: "0.78rem" }}>Permanently deletes this user and all their data. This cannot be undone.</div>

                                    {confirm === "deleteUser" ? (

                                        <div className="d-flex gap-2">
                                            <Button size="sm" variant="danger" style={{ fontSize: "0.78rem" }} onClick={() => handleDanger("deleteUser")}>Yes, delete permanently</Button>
                                            <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.78rem" }} onClick={() => setConfirm(null)}>Cancel</Button>
                                        </div>

                                    ) : (

                                        <Button size="sm" variant="danger" style={{ fontSize: "0.78rem" }} onClick={() => setConfirm("deleteUser")}>
                                            Delete User
                                        </Button>

                                    )}

                                </div>

                            </>

                        )}

                    </div>

                )}

            </div>

        </>

    );

};

export default UserDrawer;