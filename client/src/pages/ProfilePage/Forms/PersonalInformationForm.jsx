/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Row, Form, Button, Spinner } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProfileStore } from "../../../store/useProfileStore";

import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { useFormDirty } from "../../../hooks/useFormDirty"

import styles from "../../../styles/UI/Buttons.module.css";
    
const PersonalInformationForm = ({ onDirtyChange }) => {

    const { authUser } = useAuthStore();
    
    if(!authUser) return <navigate to = "/" />;

    const { profileData, fetchProfile, updatePersonalInformation, isUpdating } = useProfileStore();
    
    // Fetch full profile on mount
    const navigate = useNavigate();

    useEffect(() => {

        if (!authUser) {
            navigate("/");
            return;
        }

        fetchProfile();
    }, [authUser, navigate]);

    const [formData, setFormData] = useState({
        description: "",
        fullName: "",
        phoneNumber: "",
        location: "",
        headline: "",
        website: "",
    });

    const [originalData, setOriginalData] = useState(null);

    // Prefill from profileData
    useEffect(() => {
        if (!profileData) return;

        const formattedData = {
            description: profileData.description || "",
            fullName: profileData.fullName || "",
            phoneNumber: profileData.phoneNumber || "",
            location: profileData.location || "",
            headline: profileData.headline || "",
            website: profileData.website || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);

    }, [profileData]);

    const isFormChanged = useFormDirty(originalData, formData);

    // Notify parent when dirty state changes
    useEffect(() => { onDirtyChange?.(isFormChanged); }, [isFormChanged]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const { showToast } = useToast();

    const handleUpdatePersonalInformation = async (e) => {
        e.preventDefault();

        try {

            await updatePersonalInformation(formData);

            console.log("Personal info updated.");
            showToast("Profile updated successfully!", "success", "Update Success");
            
            setOriginalData({
                ...formData,
                age: formData.age != null ? String(formData.age) : "",
            });

        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            showToast("Profile update failed", "danger", "Update Failed");
        }
    };

    return (
        
        <>
            <Form onSubmit={ handleUpdatePersonalInformation }>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} controlId="formGridDescription">
                        <Form.Label className='fw-bold'>About</Form.Label>
                        <Form.Control as="textarea" value={formData.description} onChange={ handleChange } name="description" type="text" placeholder="Tell us about yourself" autoComplete="off" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridFullName">
                        <Form.Label className='fw-bold'>Full name*</Form.Label>
                        <Form.Control value={formData.fullName} onChange={ handleChange } name="fullName" type="text" placeholder="Full Name" autoComplete="name" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridHeadline">
                        <Form.Label className='fw-bold'>Headline*</Form.Label>
                        <Form.Control value={formData.headline} onChange={ handleChange } name="headline" type="text" placeholder="Software Engineer" autoComplete="headline" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridNumber">
                        <Form.Label className='fw-bold'>Phone*</Form.Label>
                        <Form.Control value={formData.phoneNumber} onChange={ handleChange } name="phoneNumber" type="text" placeholder="(03xx xxx xxx)" autoComplete="off" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridCity">
                        <Form.Label className='fw-bold'>City*</Form.Label>
                        <Form.Control value={formData.location} onChange={ handleChange } name="location" type="text" placeholder="Current residence city" autoComplete="off" />
                    </Form.Group>

                </Row>

                <Row className="mb-2">

                    <Form.Group as={Col} xs={12}controlId="formGridWebsite">
                        <Form.Label className='fw-bold'>Portfolio/Website</Form.Label>
                        <Form.Control value={formData.website} onChange={ handleChange } name="website" type="text" placeholder="Personal Website or Portfolio" autoComplete="url" />
                    </Form.Group>

                </Row>

                <Row className='d-flex justify-content-end'>
                    <Col xs={12} md={2} as={Button} variant='outline-primary' className={styles.submitButton} disabled={ !isFormChanged } type="submit">
                        {isUpdating ? <Spinner animation="border" size="sm" /> : "Save & Next"}
                    </Col>
                </Row>

            </Form>
        </>

    );

};
export default PersonalInformationForm;