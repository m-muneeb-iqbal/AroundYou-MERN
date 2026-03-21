import { Form } from "react-bootstrap";
import SectionHeader from "../../../common/SectionHeader";

const SkillsField = ({ value, onChange }) => (

    <>

        <SectionHeader label="Skills" />
        <Form.Group>

            <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                Comma separated
            </Form.Label>

            <Form.Control
                size="sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. React, Node.js, MongoDB"
                style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0" }}
            />
            
        </Form.Group>

    </>

);

export default SkillsField;