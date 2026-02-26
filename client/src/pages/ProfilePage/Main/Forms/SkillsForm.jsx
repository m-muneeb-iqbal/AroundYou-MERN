import { Col, Form, Row, Button} from 'react-bootstrap';
import styles from "../../../../styles/UI/Buttons.module.css";
    
const SkillsForm = () => {

    return (

        <Form>
            <Row className="mb-3">

                <Form.Group as={Col} controlId="formGridSkills">
                    <Form.Label>Skills</Form.Label>
                    <Form.Select name="skills" >

                        <option disabled >-- Choose Any --</option>
                        <option>Android Studio</option>
                        <option>Ansible</option>
                        <option>AWS</option>
                        <option>C</option>
                        <option>Caido</option>
                        <option>CI/CD</option>
                        <option>C++</option>                  
                        <option>C#</option>
                        <option>Dart</option>
                        <option>Docker</option>
                        <option>Express.js</option>
                        <option>Firebase</option>
                        <option>Flutter</option>
                        <option>Git (Version Control)</option>
                        <option>Java</option>
                        <option>JavaScript</option>
                        <option>Jenkins</option>
                        <option>Kotlin</option>
                        <option>Kubernetes</option>
                        <option>Laravel</option>
                        <option>MongoDB</option>
                        <option>MongoDB Compass</option>
                        <option>MySQL Workbench</option> 
                        <option>Node.js</option>
                        <option>Nuxt.js</option>
                        <option>PHP</option>
                        <option>Postman</option>
                        <option>Python</option>
                        <option>React.js</option>
                        <option>Socket.io</option>
                        <option>Swagger</option>
                        <option>Terraform</option>
                        <option>Visual Studio Code</option>
                        <option>Vue.js</option>
                        <option>XAMPP</option>

                    </Form.Select>
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