import { Button, Spinner } from "react-bootstrap";

import PersonalFields from "./fields/PersonalFields";
import EducationFields from "./fields/EducationFields";
import ExperienceFields from "./fields/ExperienceFields";
import SkillsField from "./fields/SkillsField";

import styles from "../../../styles/UI/Buttons.module.css";

const EditInfoTab = ({ form, edu, exp, skillsInput, isSuperAdmin, saving, isChanged, onFormChange, onEduChange, onExpChange, onSkillsChange, onSave }) => (

    <div className="p-3 d-flex flex-column gap-3">

        <PersonalFields form={form} onChange={onFormChange} isSuperAdmin={isSuperAdmin} />
        <EducationFields edu={edu} onChange={onEduChange} />
        <ExperienceFields exp={exp} onChange={onExpChange} />
        <SkillsField value={skillsInput} onChange={onSkillsChange} />

        <Button variant="outline-primary" onClick={onSave} disabled={saving || !isChanged} className={styles.submitButton} type="submit" >
            {saving ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>

    </div>

);

export default EditInfoTab;