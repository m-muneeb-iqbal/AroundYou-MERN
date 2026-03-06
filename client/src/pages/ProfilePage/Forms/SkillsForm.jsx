import { Col, Form, Row, Button } from 'react-bootstrap';
import { X } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProfileStore } from "../../../store/useProfileStore";

import { useState, useEffect } from 'react';
import { useToast } from "../../../context/ToastContext";

import styles from "../../../styles/UI/Buttons.module.css";

const skillOptions = [

    "Android Studio","Ansible","AWS","C","Caido","CI/CD","C++","C#",
    "Dart","Docker","Express.js","Firebase","Flutter","Git (Version Control)",
    "Java","JavaScript","Jenkins","Kotlin","Kubernetes","Laravel",
    "MongoDB","MongoDB Compass","MySQL Workbench","Node.js","Nuxt.js",
    "PHP","Postman","Python","React.js","Socket.io","Swagger",
    "Terraform","Visual Studio Code","Vue.js","XAMPP"

];
    
const SkillsForm = () => {

    const { authUser } = useAuthStore();
    const [skills, setSkills] = useState([]);
    const navigate = useNavigate();
   
    useEffect(() => {
        if (!authUser) {
            navigate("/");
            return;
        }
        if (authUser?.skills) {
            setSkills(authUser.skills);
        }
    }, [authUser, navigate]);

    const [selectedSkill, setSelectedSkill] = useState("");
    const [addActive, setAddActive] = useState(false);
    const { showToast } = useToast();  
    
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

    const { updateSkills } = useProfileStore();
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
                    <Col xs={12} md={2} as={Button} variant='outline-primary' className={styles.submitButton} type="submit">
                        Save Profile
                    </Col>
                </Row>

            </Form>
        
        </>

    );

};
export default SkillsForm;