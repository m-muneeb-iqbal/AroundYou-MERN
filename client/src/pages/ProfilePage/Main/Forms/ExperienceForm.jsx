/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Row, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useProfileStore } from "../../../../store/useProfileStore"

import { useEffect, useState } from "react";

import styles from "../../../../styles/UI/Buttons.module.css";

const toDateInputValue = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};
    
const ExperienceForm = () => {

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
    const navigate = useNavigate();

    if(!authUser) return <navigate to = "/" />;

    const [formData, setFormData] = useState({
        company: "",
        jobTitle: "",
        joiningDate: "",
        resignationDate: "",
    });

    // Redirect + prefill form
    useEffect(() => {
        if (!authUser) {
            navigate("/");
            return;
        }
    
        setFormData({
            company: authUser.company || "",
            jobTitle: authUser.jobTitle || "",
            joiningDate: toDateInputValue(authUser.joiningDate),
            resignationDate: toDateInputValue(authUser.resignationDate),
        });
    }, [authUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const { updateExperience } = useProfileStore();

    const handleUpdateExperience = async (e) => {
        e.preventDefault();

        try {

            await updateExperience(formData);
            console.log("Experience updated.");
            showToast("Profile updated successfully!", "success");
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            showToast("Profile update failed", "danger");
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

            <Form onSubmit={ handleUpdateExperience }>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridCompany">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control value={formData.company} onChange={ handleChange } name="company" type="text" placeholder="Company Name" />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridJobTitle">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control value={formData.jobTitle} onChange={ handleChange } name="jobTitle" type="text" placeholder="Designation" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridJoiningDate">
                        <Form.Label>Joining Date</Form.Label>
                        <Form.Control value={formData.joiningDate} onChange={ handleChange } name="joiningDate" type="date" />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridResignationDate">
                        <Form.Label>Resignation Date</Form.Label>
                        <Form.Control value={formData.resignationDate} onChange={ handleChange } name="resignationDate" type="date" />
                        <Form.Check type="checkbox" id="currentlyWorking" label="Currently working here" className="mt-2" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} className='gap-3 d-flex align-items-end justify-content-end'>

                        <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                        <Trash color="#04263D" size={30} role="button" title="Delete" />
                        
                    </Form.Group>

                </Row>

                <Row className='d-flex justify-content-end'>
                    <Col sm={12} md={2} as={Button} variant='outline-primary' className={styles.submitButton} type="submit">
                        Save & Next
                    </Col>
                </Row>

            </Form>

        </>

    );

};
export default ExperienceForm;