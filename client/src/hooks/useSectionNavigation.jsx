// hooks/useSectionNavigation.js
import { useEffect, useCallback } from "react";

export const useSectionNavigation = () => {
  // Utility: get the index of the currently active section
  const getActiveSectionIndex = useCallback(() => {
    const sections = document.querySelectorAll(".section");
    let activeIndex = -1;
    const scroll = window.scrollY + window.innerHeight / 3;

    sections.forEach((el, index) => {
      if (el.offsetTop <= scroll && el.offsetTop + el.offsetHeight > scroll) {
        activeIndex = index;
      }
    });

    return activeIndex;
  }, []);

  // Utility: update button images depending on active section
  const updateButtonImages = useCallback(() => {
    const activeSectionIndex = getActiveSectionIndex();
    const buttons = document.querySelectorAll(".image-button");
    if (!buttons.length) return; // skip if not mounted yet

    buttons.forEach((button, index) => {
      const img = button.querySelector("img");
      if (!img) return;
      img.src = 
        index === activeSectionIndex
          ? button.getAttribute("data-image-selected")
          : button.getAttribute("data-image-default");
    });
  }, [getActiveSectionIndex]);

  // On scroll → update section highlight & button icons
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      // Highlight active section
      const sections = document.querySelectorAll(".section");
      sections.forEach((el) => {
        el.classList.remove("active");
        if (el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY) {
          el.classList.add("active");
        }
      });

      updateButtonImages();
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateButtonImages]);

  // Manual scroll (when clicking a button)
  const scrollToSection = useCallback((index) => {
    const sections = document.querySelectorAll(".section");
    if (index >= 0 && index < sections.length) {
      sections[index].scrollIntoView({ behavior: "smooth" });
      updateButtonImages(); // update icons immediately
    }
  }, [updateButtonImages]);

  return { scrollToSection };
};