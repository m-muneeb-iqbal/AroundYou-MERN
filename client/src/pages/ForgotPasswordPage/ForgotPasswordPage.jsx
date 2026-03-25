import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../../lib/axios';

import { useToast } from '../../context/ToastContext';

const ForgotPasswordPage = () => {

    const navigate = useNavigate();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
            showToast('Password reset link has been sent to your email!', 'success');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send reset link. Please try again.';
            setError(errorMessage);
            showToast(errorMessage, 'danger');
        } finally {
            setIsLoading(false);
        }

    };

    return (

        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>

            <Row className="w-100">

                <Col lg={5} md={7} sm={10} xs={12} className="mx-auto">

                    {!isSubmitted ? (

                        <>
                            
                            <div className="text-center mb-4">

                                <h2 className="fw-bold mb-2" style={{ color: '#04263D' }}>
                                    Forgot Password?
                                </h2>

                                <p className="text-muted">
                                    No worries! Enter your email and we'll send you a link to reset your password.
                                </p>

                            </div>

                            <Form onSubmit={handleSubmit}>

                                <Form.Group className="mb-3">

                                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" value={email} onChange={handleChange} isInvalid={!!error} disabled={isLoading} />
                                    
                                    {error && (
                                        <Form.Control.Feedback type="invalid" className="d-block">
                                            {error}
                                        </Form.Control.Feedback>
                                    )}

                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 fw-semibold py-2 mb-3" disabled={isLoading} style={{ backgroundColor: '#04263D', borderColor: '#04263D' }} >

                                    {isLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}

                                </Button>

                                <div className="text-center">

                                    <small className="text-muted">

                                        Remember your password?{' '}
                                        <Button variant="link" className="p-0" onClick={() => navigate('/')} style={{ color: '#04263D', textDecoration: 'none' }} >
                                            Log in here
                                        </Button>

                                    </small>

                                </div>
                            </Form>

                            <Alert variant="info" className="mt-4 small">
                                <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
                            </Alert>

                        </>

                    ) : (

                        <div className="text-center">

                            <div style={{ fontSize: '3rem' }} className="mb-3">
                                ✉️
                            </div>

                            <h4 className="fw-bold" style={{ color: '#04263D' }}>
                                Check Your Email
                            </h4>

                            <p className="text-muted mb-4">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>

                            <p className="text-muted small mb-4">
                                The link will expire in 1 hour. If you don't see the email, check your spam folder.
                            </p>

                            <Button variant="outline-primary" onClick={() => navigate('/')} className="w-100" style={{ borderColor: '#04263D', color: '#04263D' }} >
                                Back to Login
                            </Button>

                        </div>

                    )}

                </Col>

            </Row>

        </Container>

    );
    
};

export default ForgotPasswordPage;