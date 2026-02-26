import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import PersonalInformationForm from "./Forms/PersonalInformationForm";
import EducationForm from "./Forms/EducationForm";
import ExperienceForm from "./Forms/ExperienceForm";
import SkillsForm from "./Forms/SkillsForm";

import styles from "../../../styles/UI/ToggleButtons.module.css";


const Middle = () => {

    const [activeTab, setActiveTab] = useState(1);

    return (

        <div>
            <ToggleButtonGroup className="d-flex justify-content-center" type="radio" name="profileTabs" value={activeTab} onChange={setActiveTab}>

                <ToggleButton className={styles.ToggleButtonForm} variant="outline-primary" id="tbg-radio-1" value={1}>
                    Personal Information
                </ToggleButton>

                <ToggleButton className={styles.ToggleButtonForm} variant="outline-primary" id="tbg-radio-2" value={2}>
                    Education & Certifications
                </ToggleButton>

                <ToggleButton className={styles.ToggleButtonForm} variant="outline-primary"id="tbg-radio-3" value={3}>
                    Experience
                </ToggleButton>

                <ToggleButton className={styles.ToggleButtonForm} variant="outline-primary"id="tbg-radio-4" value={4}>
                    Skills
                </ToggleButton>

            </ToggleButtonGroup>

            <div className="mt-4">
                {activeTab === 1 && <PersonalInformationForm />}
                {activeTab === 2 && <EducationForm />}
                {activeTab === 3 && <ExperienceForm />}
                {activeTab === 4 && <SkillsForm />}
            </div>

        </div>
    );
};

export default Middle;