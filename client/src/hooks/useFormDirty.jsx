import { useMemo } from "react";
import isEqual from "lodash.isequal";

export const useFormDirty = (originalData, currentData) => {
    return useMemo(() => {
        if (!originalData) return false;

        // Create normalized versions of the data
        const normalizedOriginal = { ...originalData };
        const normalizedCurrent = { ...currentData };

        Object.keys(normalizedOriginal).forEach((key) => {
        // Convert numeric fields to strings for comparison
        if (typeof normalizedOriginal[key] === "number") {
            normalizedOriginal[key] = String(normalizedOriginal[key] ?? "");
            normalizedCurrent[key] = String(normalizedCurrent[key] ?? "");
        }
        // Convert dates to YYYY-MM-DD string
        if (normalizedOriginal[key] instanceof Date) {
            normalizedOriginal[key] = normalizedOriginal[key].toISOString().split("T")[0];
        }
        });

        return !isEqual(normalizedOriginal, normalizedCurrent);
    }, [originalData, currentData]);
};