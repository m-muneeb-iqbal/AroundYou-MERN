import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import { useToast } from '../../context/ToastContext';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [status, setStatus] = useState('validating'); // 'validating' | 'ready' | 'loading' | 'success' | 'expired' | 'invalid'
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm: false,
    });
    const [errors, setErrors] = useState({});
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password', { replace: true });
            return;
        }
        // Basic validation - in production, could make a request to validate token
        setStatus('ready');
    }, [token]);

    const validateForm = () => {

        const newErrors = {};

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStatus('loading');
        try {
            await axiosInstance.post('/auth/reset-password', {
                token,
                newPassword: formData.password,
            });
            setStatus('success');
            showToast('Password reset successfully! You can now log in.', 'success');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password';

            if (errorMessage.includes('expired')) {
                setStatus('expired');
            } else {
                setStatus('invalid');
            }

            showToast(errorMessage, 'danger');
        }

    };

    return (

        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>

            <Row className="w-100">

                <Col lg={5} md={7} sm={10} xs={12} className="mx-auto">

                    {status === 'validating' && (

                        <div className="text-center">
                            <Spinner animation="border" style={{ color: '#04263D' }} className="mb-3" />
                            <p className="text-muted">Validating reset link...</p>
                        </div>

                    )}

                    {status === 'ready' && (

                        <>
                            <div className="text-center mb-4">

                                <h2 className="fw-bold mb-2" style={{ color: '#04263D' }}>
                                    Reset Your Password
                                </h2>

                                <p className="text-muted">
                                    Enter a new password to secure your account.
                                </p>

                            </div>

                            <Form onSubmit={handleSubmit}>

                                {/* New Password */}
                                <Form.Group className="mb-3">

                                    <Form.Label className="fw-semibold">New Password</Form.Label>
                                    <InputGroup>

                                        <Form.Control type={showPassword.password ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your new password" isInvalid={!!errors.password} />
                                        <Button variant="outline-secondary" onClick={() => handleTogglePassword('password')} className="fs-6 fw-semibold text-dark border-0" >
                                            {showPassword.password ? 'Hide' : 'Show'}
                                        </Button>

                                    </InputGroup>
                                    
                                    <Form.Text className="d-block mt-2 small">
                                        {formData.password.length > 0
                                            ? `${formData.password.length}/8 characters (min)`
                                            : 'Minimum 8 characters'}
                                    </Form.Text>

                                    {errors.password && (
                                        <Form.Control.Feedback type="invalid" className="d-block">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    )}

                                </Form.Group>

                                {/* Confirm Password */}
                                <Form.Group className="mb-4">

                                    <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                                    <InputGroup>

                                        <Form.Control type={showPassword.confirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" isInvalid={!!errors.confirmPassword} />
                                        <Button variant="outline-secondary" onClick={() => handleTogglePassword('confirm')} className="fs-6 fw-semibold text-dark border-0" >
                                            {showPassword.confirm ? 'Hide' : 'Show'}
                                        </Button>

                                    </InputGroup>

                                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                        <Form.Text className="d-block mt-2 small text-success">
                                            ✓ Passwords match
                                        </Form.Text>
                                    )}

                                    {errors.confirmPassword && (
                                        <Form.Control.Feedback type="invalid" className="d-block">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    )}

                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 fw-semibold py-2" style={{ backgroundColor: '#04263D', borderColor: '#04263D' }} >
                                    Reset Password
                                </Button>

                            </Form>

                            <Alert variant="info" className="mt-4 small">
                                <strong>Security tip:</strong> Use a strong password with letters, numbers, and symbols.
                            </Alert>

                        </>

                    )}

                    {status === 'loading' && (

                        <div className="text-center">
                            <Spinner animation="border" style={{ color: '#04263D' }} className="mb-3" />
                            <p className="text-muted">Resetting your password...</p>
                        </div>

                    )}

                    {status === 'success' && (

                        <div className="text-center">

                            <div style={{ fontSize: '3rem' }} className="mb-3">
                                ✓
                            </div>

                            <h4 className="fw-bold" style={{ color: '#04263D' }}>
                                Password Reset Successfully!
                            </h4>

                            <p className="text-muted">
                                You can now log in with your new password.
                            </p>

                            <p className="text-muted small">Redirecting you to login...</p>

                        </div>

                    )}

                    {status === 'expired' && (

                        <div className="text-center">

                            <div style={{ fontSize: '3rem' }} className="mb-3">
                                ⏰
                            </div>

                            <h4 className="fw-bold" style={{ color: '#04263D' }}>
                                Link Expired
                            </h4>

                            <p className="text-muted mb-4">
                                The password reset link has expired. Please request a new one.
                            </p>

                            <Button variant="primary" onClick={() => navigate('/forgot-password')} className="w-100" style={{ backgroundColor: '#04263D', borderColor: '#04263D' }} >
                                Request New Reset Link
                            </Button>

                        </div>

                    )}

                    {status === 'invalid' && (

                        <div className="text-center">

                            <div style={{ fontSize: '3rem' }} className="mb-3">
                                ❌
                            </div>

                            <h4 className="fw-bold" style={{ color: '#04263D' }}>
                                Invalid Reset Link
                            </h4>

                            <p className="text-muted mb-4">
                                The password reset link is invalid or has already been used.
                            </p>

                            <Button variant="primary" onClick={() => navigate('/forgot-password')} className="w-100" style={{ backgroundColor: '#04263D', borderColor: '#04263D' }} >
                                Request Password Reset
                            </Button>

                        </div>

                    )}

                </Col>

            </Row>

        </Container>

    );

};

export default ResetPasswordPage;