/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Row, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/useAuthStore";

import { useEffect, useState } from "react";
import axios from "axios";

import styles from "../../../../styles/UI/Buttons.module.css";
    
const EducationForm = () => {

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
        education: "",
        field: "",
        passingYear: "",
        cgpa: "",
        institute: "",
        certificate: "",
        provider: "",
    });

    // Redirect + prefill form
    useEffect(() => {
        if (!authUser) {
            navigate("/");
                return;
        }
    
        setFormData({
            education: authUser.education || "",
            field: authUser.field || "",
            passingYear: authUser.passingYear || "",
            cgpa: authUser.cgpa || "",
            institute: authUser.institute || "",
            certificate: authUser.certificate || "",
            provider: authUser.provider || "",
        });
    }, [authUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:5000/api/auth/update-education",
                formData,
                { withCredentials: true }
            );

            console.log("Education updated:", res.data);
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

            <Form onSubmit={ handleSubmit }>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridEducationalLevel">
                        <Form.Label>Educational Level</Form.Label>
                        <Form.Select value={formData.education} onChange={ handleChange } name="education" >
                            <option disabled >-- Choose Any --</option>
                            <option>Matriculation/O-Level</option>
                            <option>Intermediate/A-Level</option>
                            <option>DAE</option>
                            <option>Bachelors</option>
                            <option>Masters</option>
                            <option>PHD/Doctorate</option>
                            <option>ACCA</option>
                            <option>CA</option>
                            <option>CMA</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridFieldofStudy">
                        <Form.Label>Field of Study</Form.Label>
                        <Form.Select value={formData.field} onChange={ handleChange } name="field" >
                            <option disabled >-- Choose Any --</option>
                            <option>BA/BSc</option>
                            <option>BSCS (Bachelor of Science in Computer Science)</option>
                            <option>BSCS (Bachelor of Science in Software Engineering)</option>
                            <option>B.Com (Bachelor of Commerce)</option>
                            <option>BBA (Bachelor of Business Administration)</option>
                            <option>BE (Bachelor of Engineering)</option>
                            <option>BSc Engineering (Bachelor of Science in Engineering)</option>
                            <option>MBBS (Bachelor of Medicine, Bachelor of Surgery)</option>
                        </Form.Select>
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridPassingYear">
                        <Form.Label>Passing Year</Form.Label>
                        <Form.Control value={formData.passingYear} onChange={ handleChange } name="passingYear" type="number" placeholder="Passing Year" />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridCGPA">
                        <Form.Label>CGPA</Form.Label>
                        <Form.Control value={formData.cgpa} onChange={ handleChange } name="cgpa" type="number" placeholder="CGPA" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridInstitue">
                        <Form.Label>Institute</Form.Label>
                        <Form.Select value={formData.institute} onChange={ handleChange } name="institute" >
                            <option disabled >-- Choose Any --</option>
                            <option>Bahria University</option>
                            <option>COMSATS University Islamabad</option>
                            <option>CUST University</option>
                            <option>Dawood University</option>
                            <option>FAST University</option>
                            <option>Habib University</option>
                            <option>Hamdard University</option>
                            <option>MAJU University</option>
                            <option>Metropolitan University</option>
                            <option>NED University</option>
                            <option>NUML University</option>
                            <option>NUST University</option>                  
                            <option>Sir Syed University</option>
                            <option>University of Haripur</option>
                            <option>University of Karachi</option>
                            <option>University of Wah</option>
                            
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} className='gap-3 d-flex align-items-end justify-content-end'>

                        <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                        <Trash color="#04263D" size={30} role="button" title="Delete" />
                        
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridCertificate">
                        <Form.Label>Certificate/License</Form.Label>
                        <Form.Control value={formData.certificate} onChange={ handleChange } name="certificate" type="text" placeholder="Certificate or License" />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formGridProvider">
                        <Form.Label>Provider</Form.Label>
                        <Form.Control value={formData.provider} onChange={ handleChange } name="provider" type="text" placeholder="Provider" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} className='gap-3 d-flex align-items-end justify-content-end'>

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
export default EducationForm;