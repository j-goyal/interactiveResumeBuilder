import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { TOAST_POSITION } from "../utils/constants";
import "react-toastify/dist/ReactToastify.css";
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ResumeData } from "../types";
import {
  downloadResumeJSON,
  saveResume,
  uploadResumeJSON,
} from "../utils/storage";
import { useEditDetector } from "../hooks/useEditDetector";

interface HeaderProps {
  onSave: () => void;
  onLoad: (data: ResumeData) => void;
  onExport: () => Promise<void>;
  resumeData: ResumeData;
}

type DebouncedFunction = (...args: unknown[]) => void;

export default function Header({
  onSave,
  onLoad,
  onExport,
  resumeData,
}: HeaderProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const hasEdited = useEditDetector("mainSectionWithoutHeader");
  const [autosaveStatus, setAutosaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoSaveChanges = useCallback(async () => {
    setAutosaveStatus("saving");
    try {
      await onSave();
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus("idle"), 1500);
    } catch {
      setAutosaveStatus("idle");
    }
  }, [onSave]);

  const debounce = (func: DebouncedFunction, delay: number) => {
    return (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    };
  };

  const handleTyping = useCallback(debounce(autoSaveChanges, 2000), [
    autoSaveChanges,
  ]);

  useEffect(() => {
    if (hasEdited) {
      setAutosaveStatus("saving");
      handleTyping();
    }
  }, [resumeData, hasEdited, handleTyping]);

  const handleSave = async () => {
    try {
      await onSave();
      downloadResumeJSON(resumeData);
      toast.success("Resume saved as JSON successfully!", {
        position: TOAST_POSITION,
        autoClose: 3000,
      });
    } catch {
      toast.error("Please fix the validation errors before saving.", {
        position: TOAST_POSITION,
        autoClose: 3000,
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      toast.success("Resume exported to PDF successfully!", {
        position: TOAST_POSITION,
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error Exporting PDF. Please try again.",
        { position: TOAST_POSITION, autoClose: 3000 }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    try {
      const encodedData = btoa(encodeURIComponent(JSON.stringify(resumeData)));
      const link = `${window.location.origin}?resumedata=${encodedData}`;
      navigator.clipboard.writeText(link);
      toast.success("Share link copied to clipboard!", {
        position: TOAST_POSITION,
        autoClose: 3000,
      });
    } catch {
      toast.error("Failed to copy share link. Please try again.", {
        position: TOAST_POSITION,
        autoClose: 3000,
      });
    }
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await uploadResumeJSON(file);
        onLoad(data);
        saveResume(data);
        toast.success("Resume loaded successfully!", {
          position: TOAST_POSITION,
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error loading resume. Please try again.",
          { position: TOAST_POSITION, autoClose: 3000 }
        );
      }
    }
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">QuickResume</h1>
          <div className="flex flex-wrap gap-2 sm:space-x-2 sm:gap-0">
            <div className="text-sm text-gray-400 flex items-center space-x-2">
              {autosaveStatus === "saving" && (
                <AutorenewIcon className="animate-spin" />  
              )}
              {(autosaveStatus === "saved" || autosaveStatus === "idle") && (
                <CloudDoneOutlinedIcon />
              )}
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded w-full sm:w-auto"
            >
              Save As JSON
            </button>
            <label className="bg-green-700 hover:bg-green-500 px-4 py-2 rounded w-full sm:w-auto text-center flex justify-center cursor-pointer">
              Load JSON
              <input
                type="file"
                accept=".json"
                onChange={(event) => {
                  handleLoad(event);
                  event.target.value = "";
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExport}
              className="bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded w-full sm:w-auto"
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
            <button
              onClick={handleShare}
              className="bg-yellow-700 hover:bg-yellow-500 px-4 py-2 rounded w-full sm:w-auto"
            >
              Share
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
