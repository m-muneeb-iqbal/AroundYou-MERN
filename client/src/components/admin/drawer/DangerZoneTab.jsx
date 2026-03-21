import { Button } from "react-bootstrap";
import { ImageOff, BookOpen, Briefcase, Wrench, UserRoundMinus } from "lucide-react";

import DangerButton from "../../common/DangerButton";

const DangerZoneTab = ({ isSuperAdmin, confirm, onConfirm, onCancel, onAction }) => (
    
    <div className="p-3 d-flex flex-column gap-1">

        {/* Available to both Admin and SuperAdmin */}
        <DangerButton
            icon={ImageOff} label="Remove profile picture"
            confirming={confirm === "profilePic"}
            onClick={() => onConfirm("profilePic")}
            onConfirm={() => onAction("profilePic")}
            onCancel={onCancel}
        />

        <DangerButton
            icon={BookOpen} label="Clear education"
            confirming={confirm === "education"}
            onClick={() => onConfirm("education")}
            onConfirm={() => onAction("education")}
            onCancel={onCancel}
        />

        <DangerButton
            icon={Briefcase} label="Clear experience"
            confirming={confirm === "experience"}
            onClick={() => onConfirm("experience")}
            onConfirm={() => onAction("experience")}
            onCancel={onCancel}
        />

        <DangerButton
            icon={Wrench} label="Clear skills"
            confirming={confirm === "skills"}
            onClick={() => onConfirm("skills")}
            onConfirm={() => onAction("skills")}
            onCancel={onCancel}
        />

        {/* SuperAdmin only */}
        {isSuperAdmin && (

            <>

                <DangerButton
                    icon={UserRoundMinus} label="Remove all friendships"
                    confirming={confirm === "friends"}
                    onClick={() => onConfirm("friends")}
                    onConfirm={() => onAction("friends")}
                    onCancel={onCancel}
                />

                <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#fff5f5", border: "1px solid #F8D7DA" }} >

                    <div className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: "#dc3545" }}>
                        Delete User
                    </div>

                    <div className="text-muted mb-2" style={{ fontSize: "0.78rem" }}>
                        Permanently deletes this user and all their data. This cannot be undone.
                    </div>

                    {confirm === "deleteUser" ? (

                        <div className="d-flex gap-2">

                            <Button size="sm" variant="danger" style={{ fontSize: "0.78rem" }} onClick={() => onAction("deleteUser")}>
                                Yes, delete permanently
                            </Button>

                            <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.78rem" }} onClick={onCancel}>
                                Cancel
                            </Button>

                        </div>

                    ) : (

                        <Button size="sm" variant="danger" style={{ fontSize: "0.78rem" }} onClick={() => onConfirm("deleteUser")}>
                            Delete User
                        </Button>

                    )}
                    
                </div>

            </>

        )}

    </div>

);

export default DangerZoneTab;