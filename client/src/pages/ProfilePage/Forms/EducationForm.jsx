/* eslint-disable react-hooks/rules-of-hooks */
import { Col, Row, Form, Button, Spinner } from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProfileStore } from "../../../store/useProfileStore";

import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { useFormDirty } from "../../../hooks/useFormDirty"

import styles from "../../../styles/UI/Buttons.module.css";
    
const EducationForm = ({ onDirtyChange }) => {

    const fieldOptions = {
        "Matriculation/O-Level": [
            "Arts", 
            "Biology", 
            "Computer Science"
        ],
        "Intermediate/A-Level": [
            "Pre-Medical", 
            "Pre-Engineering", 
            "ICS", 
            "Commerce", 
            "Arts"
        ],
        "DAE": [
            "Electrical Technologoy", 
            "Mechanical Technology", 
            "Civil Technology",
            "Electronics Technology",
            "Computer Technologoy", 
            "Chemical Technologoy", 
            "Automotive Technology",
            "Architecture Technology",
            "1st Year", 
            "2nd Year", 
            "3rd Year", 
        ],
        "Bachelors": [
            "BA/BSc",
            "BSCS (Bachelor of Science in Computer Science)",
            "BSSE (Bachelor of Science in Software Engineering)",
            "B.Com (Bachelor of Commerce)",
            "BBA (Bachelor of Business Administration)",
            "B.E.(Bachelor of Engineering)",
            "BSc Engineering (Bachelor of Science in Engineering)",
            "MBBS (Bachelor of Medicine, Bachelor of Surgery)"
        ],
        "Masters": [
            "MA/MSc",
            "M.Com (Master of Commerce)",
            "MBA (Master of Business Administration)",
            "MS (Master of Science)",
            "MSCA (Master of Science in Computer Applications)",
            "MS (Data Science)",
            "MS (Artificial Intelligence)",
        ],
        "PHD/Doctorate": [
            "PhD Computer Science", 
            "PhD Management Sciences",
            "Course Work", 
            "Research Proposal", 
            "Research and Dissertation", 
        ],
        "ACCA": ["Accounting & Finance"],
        "CA": ["Chartered Accountancy"],
        "CMA": ["Cost & Management Accounting"]
    }; 

    const { authUser } = useAuthStore();

    if(!authUser) return <navigate to = "/" />;

    const { profileData, fetchProfile, updateEducation, deleteEducation, deleteCertification, isUpdating } = useProfileStore();

    const navigate = useNavigate();

    useEffect(() => {
        
        if (!authUser) {
            navigate("/");
            return;

        }
        fetchProfile();
    }, [authUser, navigate]);

    const [formData, setFormData] = useState({
        education: "",
        field: "",
        passingYear: "",
        cgpa: "",
        institute: "",
        certificate: "",
        provider: "",
    });

    const [originalData, setOriginalData] = useState(null);
    const isFormChanged = useFormDirty(originalData, formData);

    // Notify parent when dirty state changes
    useEffect(() => { onDirtyChange?.(isFormChanged); }, [isFormChanged]);
    useEffect(() => {

        if (!profileData) return;
    
        const formattedData = {
            education: profileData.education || "",
            field: profileData.field || "",
            passingYear: profileData.passingYear != null ? String(profileData.passingYear) : "",
            cgpa: profileData.cgpa != null ? String(profileData.cgpa) : "",
            institute: profileData.institute || "",
            certificate: profileData.certificate || "",
            provider: profileData.provider || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);

    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

    if (name === "education") {
        setFormData(prev => ({
            ...prev,
            education: value,
            field: "" 
        }));
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    }
    };

    const { showToast } = useToast(); 

    const handleUpdateEducation = async (e) => {
        e.preventDefault();

        try {

            await updateEducation(formData);

            console.log("Education updated.");
            showToast("Profile updated successfully!", "success");

            setOriginalData({
                ...formData,
                passingYear: formData.passingYear != null ? String(formData.passingYear) : "",
                cgpa: formData.cgpa != null ? String(formData.cgpa) : ""
            });

        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            showToast("Profile update failed", "danger");
        }
    };

        const handleDeleteEducation = async () => {
        try {
            
            await deleteEducation();
            console.log("Education deleted.");

            // Reset form after deletion
            setFormData({
                education: "",
                field: "",
                passingYear: "",
                cgpa: "",
                institute: ""
            });

            showToast("Education deleted successfully!", "success");
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
            showToast("Failed to delete education", "danger");
        }
    };

    const handleDeleteCertification = async () => {
        try {
            await deleteCertification();

            console.log("Education deleted.");

            // Reset form after deletion
            setFormData({
                certificate: "",
                provider: ""
            });

            showToast("Certification deleted successfully!", "success");
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
            showToast("Failed to delete education", "danger");
        }
    };

    return (

        <>

            <Form onSubmit={ handleUpdateEducation }>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridEducationalLevel">

                        <Form.Label>Educational Level</Form.Label>

                        <Form.Select value={formData.education} onChange={ handleChange } name="education" >

                            <option value="" disabled>-- Choose Any --</option>
                            {Object.keys(fieldOptions).map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}

                        </Form.Select>

                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridFieldofStudy">

                        <Form.Label>Field of Study</Form.Label>

                        <Form.Select value={formData.field} onChange={ handleChange } name="field" disabled={!formData.education}>

                            <option value="" disabled>-- Choose Any --</option>

                            {formData.education && fieldOptions[formData.education]?.map((field) => (
                                <option key={field} value={field}>{field}</option>
                            ))}

                        </Form.Select>

                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridPassingYear">

                        <Form.Label>Passing Year</Form.Label>
                        <Form.Control value={formData.passingYear} onChange={ handleChange } name="passingYear" type="number" placeholder="Passing Year" autoComplete="off" />
                        
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridCGPA">

                        <Form.Label>CGPA</Form.Label>
                        <Form.Control value={formData.cgpa} onChange={ handleChange } name="cgpa" type="number" placeholder="CGPA" autoComplete="off" />

                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridInstitue">

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
                            <option>Jinnah University for Women</option>
                            <option>MAJU University</option>
                            <option>Metropolitan University</option>
                            <option>NED University</option>
                            <option>NUML University</option>
                            <option>NUST University</option>                  
                            <option>Sir Syed University</option>
                            <option>University of Haripur</option>
                            <option>University of Karachi</option>
                            <option>University of Wah</option>
                            <option>Wah Medical College</option>
                            
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} className='gap-3 d-flex align-items-end justify-content-end'>

                        <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                        <Trash color="#04263D" size={30} role="button" title="Delete" onClick={ handleDeleteEducation }/>
                        
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridCertificate">

                        <Form.Label>Certificate/License</Form.Label>
                        <Form.Control value={formData.certificate} onChange={ handleChange } name="certificate" type="text" placeholder="Certificate or License" />

                    </Form.Group>

                    <Form.Group as={Col} xs={12} md={6} controlId="formGridProvider">

                        <Form.Label>Provider</Form.Label>
                        <Form.Control value={formData.provider} onChange={ handleChange } name="provider" type="text" placeholder="Provider" />

                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} className='gap-3 d-flex align-items-end justify-content-end'>

                        <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                        <Trash color="#04263D" size={30} role="button" title="Delete"  onClick={ handleDeleteCertification }/>
                        
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
export default EducationForm;