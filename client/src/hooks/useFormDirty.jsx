import { useMemo } from "react";
import isEqual from "lodash.isequal"; // deep comparison utility

/**
 * Tracks if a form has changed compared to initial values.
 * @param {object} initialValues - original form data
 * @param {object} currentValues - current form data
 * @returns {boolean} isDirty - true if currentValues differ from initialValues
 */

export const useFormDirty = (originalData, currentData) => {

    // If originalData is null (e.g., before load), consider form not dirty
    return useMemo(() => {
        
        if (!originalData) return false;
        return !isEqual(originalData, currentData);

    }, [originalData, currentData]);

};