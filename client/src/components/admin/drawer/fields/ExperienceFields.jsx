import { Form } from "react-bootstrap";
import SectionHeader from "../../../common/SectionHeader";

const ExperienceFields = ({ exp, onChange }) => (

    <>
        <SectionHeader label="Experience" />
        <div className="d-flex flex-column gap-2">
            {[
                { key: "company",     label: "Company"      },
                { key: "jobTitle",    label: "Job Title"    },
                { key: "joiningDate", label: "Joining Date", type: "date" },

            ].map(({ key, label, type = "text" }) => (

                <Form.Group key={key}>

                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                        {label}
                    </Form.Label>

                    <Form.Control
                        size="sm"
                        type={type}
                        value={exp[key]}
                        onChange={(e) => onChange({ ...exp, [key]: e.target.value })}
                        style={{ fontSize: "0.85rem", border: "1px solid #E0E0E0" }}
                    />

                </Form.Group>

            ))}
            <Form.Check
                type="checkbox"
                label="Currently working here"
                checked={exp.currentlyWorking}
                onChange={(e) => onChange({ ...exp, currentlyWorking: e.target.checked })}
                style={{ fontSize: "0.85rem" }}
            />

        </div>
        
    </>

);

export default ExperienceFields;