import { useCallback } from "react";

export const useScrollToSectionCover = () => {

    const scrollToSectionCover = useCallback((selector) => {

        const el = document.querySelector(selector);
        if(el)
            el.scrollIntoView({ behaviour: "smooth" });

    }, []);

    return scrollToSectionCover;  
};