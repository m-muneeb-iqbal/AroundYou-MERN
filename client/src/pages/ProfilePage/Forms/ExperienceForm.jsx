/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";

import { Col, Row, Form, Button, Spinner } from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProfileStore } from "../../../store/useProfileStore";

import { useToast } from "../../../context/ToastContext";
import { useFormDirty } from "../../../hooks/useFormDirty"

import styles from "../../../styles/UI/Buttons.module.css";

const toDateInputValue = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};
    
const ExperienceForm = ({ onDirtyChange }) => {

    const { authUser } = useAuthStore();
    
    if(!authUser) return <navigate to = "/" />;

    const { profileData, fetchProfile, updateExperience, deleteExperience, isUpdating } = useProfileStore();

    const navigate = useNavigate();

    useEffect(() => {
        
        if (!authUser) {
            navigate("/");
            return;

        }
        fetchProfile();
    }, [authUser, navigate]);

    const [formData, setFormData] = useState({
        company: "",
        jobTitle: "",
        joiningDate: "",
        resignationDate: "",
        currentlyWorking: false,
    });

    const [originalData, setOriginalData] = useState(null);
    const isFormChanged = useFormDirty(originalData, formData);

    // Notify parent when dirty state changes
    useEffect(() => { onDirtyChange?.(isFormChanged); }, [isFormChanged]);

    // Redirect + prefill form
    useEffect(() => {

        if (!profileData) return;
    
        const formattedData = {
            company: profileData.company || "",
            jobTitle: profileData.jobTitle || "",
            joiningDate: toDateInputValue(profileData.joiningDate),
            resignationDate: toDateInputValue(profileData.resignationDate),
            currentlyWorking: profileData.currentlyWorking ?? false, // important
        };

        setFormData(formattedData);
        setOriginalData(formattedData);

    }, [profileData]);

    const { showToast } = useToast();

    const handleChange = (e) => {

        const { name, type, value, checked } = e.target;

        if (name === "currentlyWorking" && checked && !formData.joiningDate) {
            showToast("You must enter Joining Date before marking as Currently working", "danger", "Validation Error");
            return;
        }

        if (name === "resignationDate" && value && !formData.joiningDate) {
            showToast("You must enter Joining Date before entering Resignation Date", "danger", "Validation Error");
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "currentlyWorking" && checked ? { resignationDate: "" } : {})
        }));
    };

    const handleUpdateExperience = async (e) => {

        e.preventDefault();
        if (!formData.company) {
            showToast("Company name is required.", "danger", "Validation Error");
            return;
        }
        if (!formData.jobTitle) {
            showToast("Job Title is required.", "danger", "Validation Error");
            return;
        }
        if (!formData.joiningDate) {
            showToast("Joining Date is required.", "danger", "Validation Error");
            return;
        }

        if (!formData.currentlyWorking && !formData.resignationDate) {
            showToast("Either tick 'Currently working' or enter Resignation Date", "danger", "Validation Error");
            return;
        }

        try {

            await updateExperience(formData);

            console.log("Experience updated.");
            showToast("Profile updated successfully!", "success", "Update Success");

            setOriginalData(formData);
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            showToast("Profile update failed", "danger", "Update Failed");
        }
    };

    const handleDeleteExperience = async () => {
        try {
            await deleteExperience();

            console.log("Experience deleted.");

            // Reset form after deletion
            setFormData({
                company: "",
                jobTitle: "",
                joiningDate: "",
                resignationDate: "",
                currentlyWorking: false,
            });

            showToast("Experience deleted successfully!", "success", "Delete Success");
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
            showToast("Failed to delete experience", "danger", "Delete Failed");
        }
    };

    return (

        <>

            <Form onSubmit={ handleUpdateExperience } noValidate>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridCompany">
                        <Form.Label className="fw-bold">Company or organization*</Form.Label>
                        <Form.Control value={formData.company} onChange={ handleChange } name="company" type="text" placeholder="Company Name" autoComplete="organization" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridJobTitle">
                        <Form.Label className="fw-bold">Title*</Form.Label>
                        <Form.Control value={formData.jobTitle} onChange={ handleChange } name="jobTitle" type="text" placeholder="Ex: Power Bi Developer" autoComplete="organization-title" />
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridJoiningDate">
                        <Form.Label className="fw-bold">Joining date*</Form.Label>
                        <Form.Control value={formData.joiningDate} onChange={ handleChange } name="joiningDate" type="date" autoComplete="off" />
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridResignationDate">
                        <Form.Label className="fw-bold">Resignation date*</Form.Label>
                        <Form.Control value={formData.resignationDate ?? ""} onChange={ handleChange } name="resignationDate" type="date" disabled={formData.currentlyWorking} autoComplete="off" />
                        <Form.Check type="checkbox" id="currentlyWorking" label="Currently working" name="currentlyWorking" className="mt-2" checked={formData.currentlyWorking} onChange={handleChange}/>
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} className='gap-3 d-flex align-items-end justify-content-end'>

                        <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                        <Trash color="#04263D" size={30} role="button" title="Delete"  onClick={ handleDeleteExperience }/>
                        
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
export default ExperienceForm;