import { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';

import { useAuthStore } from '../../../store/useAuthStore';

import { useToast } from '../../../context/ToastContext';

import styles from '../../../styles/UI/Buttons.module.css';

const ChangePasswordForm = ({ onDirtyChange }) => {

    const { changePassword, isChangingPassword } = useAuthStore();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState({});

    // Notify parent when any password field is filled in
    const isFormChanged = Object.values(formData).some((v) => v.trim() !== '');
    useEffect(() => { onDirtyChange?.(isFormChanged); }, [isFormChanged]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
            showToast(newErrors.currentPassword, "danger", "Validation Error");
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
            showToast(newErrors.newPassword, "danger", "Validation Error");
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
            showToast(newErrors.newPassword, "danger", "Validation Error");
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
            showToast(newErrors.confirmPassword, "danger", "Validation Error");
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            showToast(newErrors.confirmPassword, "danger", "Validation Error");
        }

        if (formData.currentPassword === 'formData.newPassword') {
            newErrors.newPassword = 'New password must be different from current password';
            showToast(newErrors.newPassword, "danger", "Validation Error");
        }

        return newErrors;

    };

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }

    };

    const handleTogglePassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleResetPassword = async (e) => {

        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {

            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            showToast('Password changed successfully!', 'success', 'Change Password Success');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Failed to change password';
            showToast(errorMessage, 'danger', 'Change Password Failed');
        }

    };

    return (

        <Container className="mt-0">

            <Row className="justify-content-center">

                <Col lg={6} md={8} sm={12}>

                    <Alert variant="info" className="mb-4">

                        <strong className="d-block mb-2">Security Tips:</strong>
                        <ul className="mb-0 ms-3 small">
                            <li>Use a combination of letters, numbers, and symbols</li>
                            <li>Avoid using easily guessable information</li>
                            <li>Don't reuse passwords from other accounts</li>
                        </ul>

                    </Alert>

                    <Form onSubmit={handleResetPassword}>

                        {/* Current Password */}
                        <Form.Group className="mb-3">

                            <Form.Label className="fw-bold">Current Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={showPassword.current ? 'text' : 'password'} name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter your current password" isInvalid={!!errors.currentPassword} autoComplete="current-password" />
                                <Button  variant="outline-primary" onClick={() => handleTogglePassword('current')} className={styles.resetButton} style={{ padding: '0.375rem 0.75rem' }} >
                                    {showPassword.current ? 'Hide' : 'Show'}
                                </Button>

                            </InputGroup>

                        </Form.Group>

                        {/* New Password */}
                        <Form.Group className="mb-3">

                            <Form.Label className="fw-bold">New Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={showPassword.new ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter your new password" isInvalid={!!errors.newPassword} autoComplete="new-password" />
                                <Button variant="outline-primary" onClick={() => handleTogglePassword('new')} className={styles.resetButton} style={{ padding: '0.375rem 0.75rem' }} >
                                    {showPassword.new ? 'Hide' : 'Show'}
                                </Button>

                            </InputGroup>

                        </Form.Group>

                        {/* Confirm Password */}
                        <Form.Group className="mb-4">

                            <Form.Label className="fw-bold">Confirm Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={showPassword.confirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your new password" isInvalid={!!errors.confirmPassword} autoComplete="new-password" />
                                <Button variant="outline-primary" onClick={() => handleTogglePassword('confirm')} className={styles.resetButton} style={{ padding: '0.375rem 0.75rem' }} >
                                    {showPassword.confirm ? 'Hide' : 'Show'}
                                </Button>

                            </InputGroup>

                            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                                <Form.Text className="d-block mt-2 small text-success">
                                    ✓ Passwords match
                                </Form.Text>
                            )}

                        </Form.Group>

                        {/* Submit Button */}
                        <Row className="mb-4">

                            <Col>

                                <Button variant="outline-primary" type="submit" disabled={isChangingPassword} className={`w-100 ${styles.resetButton}`} >

                                    {isChangingPassword ? <Spinner animation="border" size="sm" /> : "Reset Password"}

                                </Button>

                            </Col>
                            
                        </Row>

                    </Form>

                </Col>

            </Row>

        </Container>

    );

};

export default ChangePasswordForm;