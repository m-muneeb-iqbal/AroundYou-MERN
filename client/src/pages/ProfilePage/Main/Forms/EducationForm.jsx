import { Col, Form, Row, Button} from 'react-bootstrap';
import { SquarePlus, Trash } from 'lucide-react';

import styles from "../../../../styles/UI/Buttons.module.css";
    
const EducationForm = () => {

    return (

        <Form>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridEducationalLevel">
                    <Form.Label>Educational Level</Form.Label>
                    <Form.Select name="educationalLevel" >
                        <option disabled >-- Choose Any --</option>
                        <option>Matriculation/O-Level</option>
                        <option>Intermediate/A-Level</option>
                        <option>DAE</option>
                        <option>Bachelors</option>
                        <option>Masters</option>
                        <option>PHD/Doctorate</option>
                        <option>ACCA</option>
                        <option>CA</option>
                        <option>CMA</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridFieldofStudy">
                    <Form.Label>Field of Study</Form.Label>
                    <Form.Select name="fieldOfStudy" >
                        <option disabled >-- Choose Any --</option>
                        <option>BA/BSc</option>
                        <option>BSCS (Bachelor of Science in Computer Science)</option>
                        <option>BSCS (Bachelor of Science in Software Engineering)</option>
                        <option>B.Com (Bachelor of Commerce)</option>
                        <option>BBA (Bachelor of Business Administration)</option>
                        <option>BE (Bachelor of Engineering)</option>
                        <option>BSc Engineering (Bachelor of Science in Engineering)</option>
                        <option>MBBS (Bachelor of Medicine, Bachelor of Surgery)</option>
                    </Form.Select>
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridPassingYear">
                    <Form.Label>Passing Year</Form.Label>
                    <Form.Control name="passingYear" type="number" placeholder="Passing Year" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCGPA">
                    <Form.Label>CGPA</Form.Label>
                    <Form.Control name="CGPA" type="number" placeholder="CGPA" />
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridInstitue">
                    <Form.Label>Institute</Form.Label>
                    <Form.Select name="institute" >
                        <option disabled >-- Choose Any --</option>
                        <option>Bahria University</option>
                        <option>COMSATS University Islamabad</option>
                        <option>CUST University</option>
                        <option>Dawood University</option>
                        <option>FAST University</option>
                        <option>Habib University</option>
                        <option>Hamdard University</option>
                        <option>MAJU University</option>
                        <option>Metropolitan University</option>
                        <option>NED University</option>
                        <option>NUML University</option>
                        <option>NUST University</option>                  
                        <option>Sir Syed University</option>
                        <option>University of Haripur</option>
                        <option>University of Karachi</option>
                        <option>University of Wah</option>
                        
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Col} className='gap-3 d-flex align-items-end justify-content-end'>

                    <SquarePlus color="#04263D" size={30} role="button" title="Add more" />
                    <Trash color="#04263D" size={30} role="button" title="Delete" />
                    
                </Form.Group>

            </Row>

            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridCertificate">
                    <Form.Label>Certificate/License</Form.Label>
                    <Form.Control name="certificate" type="text" placeholder="Certificate or License" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridProvider">
                    <Form.Label>Provider</Form.Label>
                    <Form.Control name="provider" type="text" placeholder="Provider" />
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
export default EducationForm;