import { Col, Form, Row, Button} from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import styles from "../../../../styles/UI/Buttons.module.css";
    
const ExperienceForm = () => {

    return (

        <Form>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridCompany">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control name="company" type="text" placeholder="Company Name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridJobTitle">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control name="jobTitle" type="text" placeholder="Designation" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridJoiningDate">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control name="joiningDate" type="date" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridResignationDate">
                    <Form.Label>Resignation Date</Form.Label>
                    <Form.Control name="resignationDate" type="date" />
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