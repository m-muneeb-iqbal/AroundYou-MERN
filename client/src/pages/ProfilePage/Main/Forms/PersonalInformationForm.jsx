import { Col, Form, Row, Button} from 'react-bootstrap';
import styles from "../../../../styles/UI/Buttons.module.css";
    
const PersonalInformationForm = () => {

    return (

        <Form>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" type="text" placeholder="Full Name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Your Email Address" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridDob">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control name="dob" type="date" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridNumber">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="number" type="text" placeholder="Phone Number" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control  name="age" type="number" placeholder="Age" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select name="role" >
                        <option disabled >-- Select your role --</option>
                        <option>Alumni</option>
                        <option>Student</option>
                    </Form.Select>
                </Form.Group>

            </Row>

            <Row className="mb-2">

                <Form.Group as={Col} controlId="formGridWebsite">
                    <Form.Label>Portfolio/Website</Form.Label>
                    <Form.Control  name="website" type="text" placeholder="Personal Website or Portfolio" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCompany">
                    <Form.Label>Current residence city</Form.Label>
                    <Form.Control name="company" type="text" placeholder="Company" />
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
export default PersonalInformationForm;