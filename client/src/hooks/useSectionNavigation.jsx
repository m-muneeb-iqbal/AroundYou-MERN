import { useEffect } from "react";

export const useSectionNavigation = () => {

  // showing button navigation icon container
  function showButtonContainer() {
    const scroll = window.scrollY + window.innerHeight / 3;
    const sections = document.querySelectorAll(".section3");

    sections.forEach((el) => {
      el.classList.remove("active");

      if (el.offsetTop <= scroll && el.offsetTop + el.offsetHeight > scroll) {
        el.classList.add("active");
      }
    });
  }

  // change images on scroll & navigation icons
  function changeImage() {
    const scroll = window.scrollY + window.innerHeight / 3;

    [...document.getElementsByClassName("section")].forEach((el) => {
      el.classList.remove("active");

      if (el.offsetTop <= scroll && el.offsetTop + el.offsetHeight > scroll) {
        el.classList.add("active");
      }
    });
  }

  // for updateButtonImages() to function properly
  function getActiveSectionIndex() {
    const sections = document.querySelectorAll(".section");
    let activeIndex = -1;

    const scroll = window.scrollY + window.innerHeight / 3;

    sections.forEach((el, index) => {
      if (el.offsetTop <= scroll && el.offsetTop + el.offsetHeight > scroll) {
        activeIndex = index;
      }
    });

    return activeIndex;
  }

  // update navigation button icons on events
  function updateButtonImages() {
    const activeSectionIndex = getActiveSectionIndex();
    const buttons = document.querySelectorAll(".image-button");

    buttons.forEach((button, index) => {
      const defaultImageSrc = button.getAttribute("data-image-default");
      const selectedImageSrc = button.getAttribute("data-image-selected");

      if (index === activeSectionIndex) {
        button.querySelector("img").setAttribute("src", selectedImageSrc);
      } else {
        button.querySelector("img").setAttribute("src", defaultImageSrc);
      }
    });
  }

  // scroll to a specific section (used by your buttons)
  function scrollToSection(index) {
    const sections = document.querySelectorAll(".section");
    if (sections[index]) {
      window.scrollTo({
        top: sections[index].offsetTop,
        behavior: "smooth",
      });
    }
  }

  // attach scroll listener
  useEffect(() => {
    function handleScroll() {
      changeImage();
      showButtonContainer();
      updateButtonImages();
    }

    window.addEventListener("scroll", handleScroll);

    // initialize state on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollToSection };
};