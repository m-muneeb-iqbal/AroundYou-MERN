/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Row, Form, Button } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useProfileStore } from "../../../../store/useProfileStore";

import { useEffect, useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import { useFormDirty } from "../../../../hooks/useFormDirty"

import styles from "../../../../styles/UI/Buttons.module.css";

const toDateInputValue = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};
    
const PersonalInformationForm = () => {

    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    if(!authUser) return <navigate to = "/" />;
    
    const [formData, setFormData] = useState({
        description: "",
        fullName: "",
        email: "",
        dob: "",
        phoneNumber: "",
        age: "",
        location: "",
        website: "",
    });

    const [originalData, setOriginalData] = useState(null);

    // Redirect + prefill formx
    useEffect(() => {
        if (!authUser) {
            navigate("/");
            return;
        }
    
        const formattedData = {
            description: authUser.description || "",
            fullName: authUser.fullName || "",
            email: authUser.email || "",
            dob: toDateInputValue(authUser.dob),
            phoneNumber: authUser.phoneNumber || "",
            age: authUser.age != null ? String(authUser.age) : "",
            location: authUser.location || "",
            website: authUser.website || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);

    }, [authUser, navigate]);

    const isFormChanged = useFormDirty(originalData, formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const { updatePersonalInformation } = useProfileStore();
    const { showToast } = useToast();

    const handleUpdatePersonalInformation = async (e) => {
        e.preventDefault();

        try {

            await updatePersonalInformation(formData);

            console.log("Personal info updated.");
            showToast("Profile updated successfully!", "success");
            
            setOriginalData({
                ...formData,
                age: formData.age != null ? String(formData.age) : "",
            });
            
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            showToast("Profile update failed", "danger");
        }
    };

    return (
        
        <>
            <Form onSubmit={ handleUpdatePersonalInformation }>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} controlId="formGridDescription">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" value={formData.description} onChange={ handleChange } name="description" type="text" placeholder="Tell us about yourself" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control value={formData.fullName} onChange={ handleChange } name="fullName" type="text" placeholder="Full Name" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={formData.email} onChange={ handleChange } name="email" type="email" placeholder="yourname@example.com" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridDob">
                        <Form.Label>Date of birth</Form.Label>
                        <Form.Control value={formData.dob} onChange={ handleChange } name="dob" type="date" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridNumber">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control value={formData.phoneNumber} onChange={ handleChange } name="phoneNumber" type="text" placeholder="(03xx xxx xxx)" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control value={formData.age} onChange={ handleChange } name="age" type="number" placeholder="21" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control value={formData.location} onChange={ handleChange } name="location" type="text" placeholder="Current residence city" />
                    </Form.Group>

                </Row>

                <Row className="mb-2">

                    <Form.Group as={Col} xs={12} controlId="formGridWebsite">
                        <Form.Label>Portfolio/Website</Form.Label>
                        <Form.Control value={formData.website} onChange={ handleChange } name="website" type="text" placeholder="Personal Website or Portfolio" />
                    </Form.Group>

                </Row>

                <Row className='d-flex justify-content-end'>
                    <Col xs={12} md={2} as={Button} variant='outline-primary' className={styles.submitButton} disabled={ !isFormChanged } type="submit">
                        Save & Next
                    </Col>
                </Row>

            </Form>
        </>

    );

};
export default PersonalInformationForm;