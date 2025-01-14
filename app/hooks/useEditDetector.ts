import { useEffect, useState } from "react";

export const useEditDetector = () => {
  const [hasEdited, setHasEdited] = useState(false);

  const handleUserInput = () => setHasEdited(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasEdited) {
        setHasEdited(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasEdited]);

  useEffect(() => {
    document.addEventListener("input", handleUserInput);

    return () => {
      document.removeEventListener("input", handleUserInput);
    };
  }, []);

  const handleSectionChange = () => {
    setHasEdited(true);
  };

  useEffect(() => {
    const addButton = document.getElementById("addSectionButton");

    const attachRemoveButtonListeners = () => {
      const removeButtons = document.querySelectorAll(".removeSectionButton");
      removeButtons.forEach((button) => {
        button.addEventListener("click", handleSectionChange);
      });
    };

    setTimeout(() => {
      attachRemoveButtonListeners();
      if (addButton) {
        addButton.addEventListener("click", handleSectionChange);
      }
    }, 500);

    return () => {
      if (addButton)
        addButton.removeEventListener("click", handleSectionChange);
    };
  }, []);

  return hasEdited;
};
