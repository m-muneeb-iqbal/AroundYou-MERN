import { Col, Form, Row, Button, Toast, ToastContainer } from 'react-bootstrap';
import { X } from 'lucide-react';

import { useAuthStore } from "../../../../store/useAuthStore";
import { useProfileStore } from "../../../../store/useProfileStore";

import { useState, useEffect } from 'react';

import styles from "../../../../styles/UI/Buttons.module.css";

const skillOptions = [

    "Android Studio","Ansible","AWS","C","Caido","CI/CD","C++","C#",
    "Dart","Docker","Express.js","Firebase","Flutter","Git (Version Control)",
    "Java","JavaScript","Jenkins","Kotlin","Kubernetes","Laravel",
    "MongoDB","MongoDB Compass","MySQL Workbench","Node.js","Nuxt.js",
    "PHP","Postman","Python","React.js","Socket.io","Swagger",
    "Terraform","Visual Studio Code","Vue.js","XAMPP"

];
    
const SkillsForm = () => {

    const [addActive, setAddActive] = useState(false);

    const [position] = useState('top-end');
    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });

        // auto-hide after 4 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 7000);
    };

    const [toast, setToast] = useState({
        show: false,
        message: "",
        variant: "",   // "success" or "danger"
    });

    const { authUser } = useAuthStore();
    const { updateSkills } = useProfileStore();

    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");

    useEffect(() => {
        if (authUser?.skills) {
            setSkills(authUser.skills);
        }
    }, [authUser]);

    const handleAddSkill = (e) => {

        if (!selectedSkill) {
            showToast("Please select a skill before adding.", "danger");
            return;
        }

        if (skills.includes(selectedSkill)) {
            showToast("Skill already added", "danger");
            return;
        }

        setSkills(prev => [...prev, selectedSkill]);
        setSelectedSkill("");


        setAddActive(true);

        setTimeout(() => {
            setAddActive(false);
            e.target.blur();
        }, 500); // 2 seconds
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(prev => prev.filter(skill => skill !== skillToRemove));
    };

    const handleUpdateSkill = async (e) => {
        e.preventDefault();

        try {
            await updateSkills({ skills });
            console.log("Skills updated.");
            showToast("Profile updated successfully!", "success");
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            console.error(err.response?.data || err.message);
        }
    };

    return (

        <>
        
            <ToastContainer className='p-3' position={position} style={{ zIndex: 1 }}>

                <Toast
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                    show={toast.show}
                    bg={toast.variant === "success" ? "success" : "danger"}
                    delay={4000}
                    autohide
                >
                    <Toast.Header>
                    <strong className="me-auto">
                        {toast.variant === "success" ? "Success" : "Error"}
                    </strong>
                    <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>

            </ToastContainer>

            <Form onSubmit={ handleUpdateSkill }>
            
                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formGridSkills">
                        <Form.Label>Skills</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Select
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                            >
                                <option value="">-- Choose Skill --</option>
                                {skillOptions.map(skill => (
                                    <option key={skill}>{skill}</option>
                                ))}
                            </Form.Select>

                            <Button variant="outline-primary" onClick={handleAddSkill} className={`${styles.addButton} ${addActive ? styles.addButtonActive : ""}`}>
                                {addActive ? "Added" : "Add"}
                            </Button>
                        </div>

                        <div className="mt-3 d-flex flex-wrap gap-2">

                            {skills.map((skill) => (

                                <div key={skill} className="d-flex align-items-center px-3 py-1 rounded-pill border" style={{ backgroundColor: "#eef4ff", fontSize: "0.9rem", gap: "8px" }} >

                                    <span>{skill}</span>

                                    <X size={16} role="button" style={{ cursor: "pointer" }} onClick={() => handleRemoveSkill(skill)} title={`Remove ${skill}`} />

                                </div>
                            ))}

                        </div>

                    </Form.Group>

                </Row>

                <Row className='d-flex justify-content-end'>
                    <Col sm={12} md={2} as={Button} variant='outline-primary' className={styles.submitButton} type="submit">
                        Save Profile
                    </Col>
                </Row>

            </Form>
        
        </>

    );

};
export default SkillsForm;