import { Form } from "react-bootstrap";
import SectionHeader from "../../../common/SectionHeader";

const PersonalFields = ({ form, onChange, isSuperAdmin }) => (

    <>

        <SectionHeader label="Personal" />
        <div className="d-flex flex-column gap-2">
            
            {[
                { key: "fullName",    label: "Full Name"   },
                { key: "email",       label: "Email"       },
                { key: "location",    label: "Location"    },
                { key: "designation", label: "Designation" },

            ].map(({ key, label }) => (

                <Form.Group key={key}>

                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                        {label}
                    </Form.Label>

                    <Form.Control
                        size="sm"
                        value={form[key]}
                        onChange={(e) => onChange({ ...form, [key]: e.target.value })}
                        style={{ fontSize: "0.85rem", border: "1px solid #E0E0E0" }}
                    />
                </Form.Group>

            ))}

            <Form.Group>

                <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                    Description
                </Form.Label>
                
                <Form.Control
                    as="textarea"
                    rows={3}
                    size="sm"
                    value={form.description}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                    style={{ fontSize: "0.85rem", border: "1px solid #e0e0e0", resize: "none" }}
                />
            </Form.Group>

            {/* Role — SuperAdmin only, SuperAdmin cannot be assigned */}
            {isSuperAdmin && (

                <Form.Group>

                    <Form.Label style={{ fontSize: "0.78rem", color: "#898C8F", marginBottom: 2 }}>
                        Role
                    </Form.Label>

                    <Form.Select size="sm" value={form.role} onChange={(e) => onChange({ ...form, role: e.target.value })} style={{ fontSize: "0.85rem", border: "1px solid #E0E0E0" }} >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </Form.Select>
                    
                </Form.Group>

            )}

        </div>

    </>
    
);

export default PersonalFields;