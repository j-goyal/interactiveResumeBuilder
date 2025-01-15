"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ResumePreview from "./components/ResumePreview";
import { ResumeData, Section } from "./types";
import { defaultResumeData } from "./utils/defaultData";
import { saveResume, loadResume } from "./utils/storage";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { exportToPDF } from "./utils/pdfExport";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FormikProps, FormikValues } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { TOAST_POSITION } from "./utils/constants";
import "react-toastify/dist/ReactToastify.css";

function ResumePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTemplate, setActiveTemplate] = useState<string>("modern");
  const [history, setHistory] = useState<ResumeData[]>([defaultResumeData]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resumedataParam = searchParams.get("resumedata");
    if (resumedataParam) {
      try {
        router.replace(pathName);
        const decodedData = decodeURIComponent(atob(resumedataParam));
        const resumeParsedData = JSON.parse(decodedData);
        if (resumeParsedData) {
          setResumeData(resumeParsedData);
          setHistory([resumeParsedData]);
        }
      } catch {
        toast.error("Invalid resume data in URL. Loading default resume.", {
          position: TOAST_POSITION,
          autoClose: 3000,
        });
      }
    } else {
      const savedData = loadResume();
      if (savedData) {
        setResumeData(savedData);
        setHistory([savedData]);
      }
    }
  }, [searchParams, pathName, router]);

  const handleSave = useCallback(async () => {
    if (formikRef.current) {
      try {
        const errors = await formikRef.current.validateForm();
        if (Object.keys(errors).length > 0) {
          throw new Error("Validation failed");
        }
        await saveResume(resumeData);
      } catch (error) {
        throw error;
      }
    }
  }, [resumeData]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setResumeData(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  useKeyboardShortcuts(handleSave, handleUndo);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sections = Array.from(resumeData.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    setResumeData({ ...resumeData, sections });
    updateHistory({ ...resumeData, sections });
  };

  const handleDataChange = (newData: Partial<ResumeData>) => {
    const updatedData = { ...resumeData, ...newData };
    setResumeData(updatedData);
    updateHistory(updatedData);
  };

  const handleSectionChange = (sectionId: string, data: Partial<Section>) => {
    const updatedSections = resumeData.sections.map((section) =>
      section.id === sectionId ? { ...section, ...data } : section
    );
    handleDataChange({ sections: updatedSections });
  };

  const updateHistory = (newData: ResumeData) => {
    setHistory([...history.slice(0, historyIndex + 1), newData]);
    setHistoryIndex(historyIndex + 1);
  };

  const handleExport = useCallback(async () => {
    if (formikRef.current) {
      try {
        const errors = await formikRef.current.validateForm();
        if (Object.keys(errors).length > 0) {
          throw new Error();
        } else {
          try {
            await exportToPDF(
              resumeRef as React.RefObject<HTMLElement>,
              `${resumeData.name.replace(/\s+/g, "_")}_resume.pdf`
            );
          } catch {
            throw new Error(
              "An error occurred while exporting the resume. Please try again."
            );
          }
        }
      } catch {
        throw new Error("Please fix validation errors before exporting");
      }
    }
  }, [resumeData.name]);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header
          onSave={handleSave}
          onLoad={(data) => {
            setResumeData(data);
            updateHistory(data);
          }}
          onExport={handleExport}
          resumeData={resumeData}
        />
        <div id="mainSectionWithoutHeader" className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Sidebar
              ref={formikRef}
              resumeData={resumeData}
              onDataChange={handleDataChange}
              onSectionChange={handleSectionChange}
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
            />
            <ResumePreview
              ref={resumeRef}
              resumeData={resumeData}
              template={activeTemplate}
            />
          </DragDropContext>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ResumePage />
    </Suspense>
  );
}
