import { useEffect, useState } from "react";

export const useEditDetector = (targetElementId: string) => {
  const [hasEdited, setHasEdited] = useState(false);

  const handleUserInput = () => setHasEdited(true);

  useEffect(() => {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    targetElement.addEventListener("input", handleUserInput);

    return () => {
      targetElement.removeEventListener("input", handleUserInput);
    };
  }, [targetElementId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasEdited) {
        setHasEdited(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasEdited]);

  useEffect(() => {
    const addButton = document.getElementById("addSectionButton");

    const attachRemoveButtonListeners = () => {
      const targetElement = document.getElementById(targetElementId);
      if (!targetElement) return;

      const removeButtons = targetElement.querySelectorAll(".removeSectionButton");
      removeButtons.forEach((button) => {
        button.addEventListener("click", handleUserInput);
      });
    };

    setTimeout(() => {
      attachRemoveButtonListeners();
      if (addButton) {
        addButton.addEventListener("click", handleUserInput);
      }
    }, 500);

    return () => {
      if (addButton)
        addButton.removeEventListener("click", handleUserInput);
    };
  }, [targetElementId]);

  return hasEdited;
};
