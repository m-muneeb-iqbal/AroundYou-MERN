/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Form, Row, Button} from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/useAuthStore";

import { useEffect, useState } from "react";
import axios from "axios";

import styles from "../../../../styles/UI/Buttons.module.css";

const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
    
const ExperienceForm = () => {

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:5000/api/auth/update-experience",
                formData,
                { withCredentials: true }
            );

            console.log("Experience updated:", res.data);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            alert("Failed to update profile.");
        }
    };
    return (

        <Form onSubmit={ handleSubmit }>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridCompany">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control value={formData.company} onChange={ handleChange } name="company" type="text" placeholder="Company Name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridJobTitle">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control value={formData.jobTitle} onChange={ handleChange } name="jobTitle" type="text" placeholder="Designation" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridJoiningDate">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control value={formData.joiningDate} onChange={ handleChange } name="joiningDate" type="date" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridResignationDate">
                    <Form.Label>Resignation Date</Form.Label>
                    <Form.Control value={formData.resignationDate} onChange={ handleChange } name="resignationDate" type="date" />
                    <Form.Check type="checkbox" id="currentlyWorking" label="Currently working here" className="mt-2" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} className='gap-3 d-flex align-items-end justify-content-end'>

                    <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                    <Trash color="#04263D" size={30} role="button" title="Delete" />
                    
                </Form.Group>

            </Row>

            <div className="d-flex justify-content-end">
                <Button variant='outline-primary' className={styles.submitButton} type="submit">
                    Save & Next
                </Button>
            </div>

        </Form>

    );

};
export default ExperienceForm;