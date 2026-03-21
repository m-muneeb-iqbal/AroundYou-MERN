import { Form } from "react-bootstrap";
import SectionHeader from "../../../common/SectionHeader";

const EducationFields = ({ edu, onChange }) => (

    <>

        <SectionHeader label="Education" />
        <div className="d-flex flex-column gap-2">

            {[
                { key: "education",  label: "Level"        },
                { key: "field",      label: "Field"        },
                { key: "institute",  label: "Institute"    },
                { key: "passingYear",label: "Passing Year" },
                { key: "cgpa",       label: "CGPA"         },
                { key: "certificate",label: "Certificate"  },
                { key: "provider",   label: "Provider"     },

            ].map(({ key, label }) => (

                <Form.Group key={key}>

                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                        {label}
                    </Form.Label>
                    <Form.Control
                        size="sm"
                        value={edu[key]}
                        onChange={(e) => onChange({ ...edu, [key]: e.target.value })}
                        style={{ fontSize: "0.85rem", border: "1px solid #E0E0E0" }} />
                </Form.Group>

            ))}

        </div>

    </>

);

export default EducationFields;