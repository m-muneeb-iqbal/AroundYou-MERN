import { Col, Form, Row, Button} from 'react-bootstrap';
import styles from "../../../../styles/UI/Buttons.module.css";
    
const SkillsForm = () => {

    return (

        <Form>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" type="text" placeholder="Your Full Name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Your Email Address" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridDesignation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control name="jobTitle" type="text" placeholder="Your Designation" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select  name="role" >
                        <option disabled >-- Select your role --</option>
                        <option>Alumni</option>
                        <option>Student</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCompany">
                    <Form.Label>Company</Form.Label>
                    <Form.Control name="company" type="text" placeholder="Your Company Name" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control  name="location" type="text" placeholder="Your City of Residence" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridWebsite">
                    <Form.Label>Portfolio/Website</Form.Label>
                    <Form.Control  name="website" type="text" placeholder="Your Personal Website or Portfolio" />
                </Form.Group>

            </Row>

            <div className="d-flex justify-content-end">
                <Button variant='outline-primary' className={styles.submitButton} type="submit">
                    Save Profile
                </Button>
            </div>


        </Form>

    );

};
export default SkillsForm;