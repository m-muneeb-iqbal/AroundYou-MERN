import { useState, useRef } from "react";
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import PersonalInformationForm from "./Forms/PersonalInformationForm";
import EducationForm from "./Forms/EducationForm";
import ExperienceForm from "./Forms/ExperienceForm";
import SkillsForm from "./Forms/SkillsForm";
import ChangePasswordForm from "./Forms/ChangePasswordForm";

import styles from "../../styles/UI/ToggleButtons.module.css";


const Bottom = () => {

    const [activeTab, setActiveTab] = useState(1);
    const dirtyRef = useRef(false);

    const handleDirtyChange = (isDirty) => {
        dirtyRef.current = isDirty;
    };

    const handleTabChange = (newTab) => {
        if (dirtyRef.current && !window.confirm("You have unsaved changes. Discard them and switch tabs?")) {
            return;
        }
        dirtyRef.current = false;
        setActiveTab(newTab);
    };

    return (

        <>
            <ToggleButtonGroup className={`d-flex ${styles.tabs}`} type="radio" name="profileTabs" value={activeTab} onChange={handleTabChange}>

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

                <ToggleButton className={styles.ToggleButtonForm} variant="outline-primary"id="tbg-radio-5" value={5}>
                    Security & Password
                </ToggleButton>

            </ToggleButtonGroup>

            <div className="mt-4">
                {activeTab === 1 && <PersonalInformationForm onDirtyChange={handleDirtyChange} />}
                {activeTab === 2 && <EducationForm onDirtyChange={handleDirtyChange} />}
                {activeTab === 3 && <ExperienceForm onDirtyChange={handleDirtyChange} />}
                {activeTab === 4 && <SkillsForm onDirtyChange={handleDirtyChange} />}
                {activeTab === 5 && <ChangePasswordForm onDirtyChange={handleDirtyChange} />}
            </div>

        </>
    );
};

export default Bottom;