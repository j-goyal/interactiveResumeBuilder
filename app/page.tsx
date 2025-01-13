'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ResumePreview from './components/ResumePreview'
import { ResumeData, Section } from './types'
import { defaultResumeData } from './utils/defaultData'
import { saveResume, loadResume } from './utils/storage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { exportToPDF } from './utils/pdfExport'
import { useFormValidation, validationRules } from './hooks/useFormValidation'

export default function Home() {
  const formikRef = useRef<any>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [activeTemplate, setActiveTemplate] = useState('modern')
  const [history, setHistory] = useState<ResumeData[]>([defaultResumeData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const resumeRef = useRef<HTMLDivElement>(null)

  const { validateAll } = useFormValidation(
    {
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      github: resumeData.github || '',
      linkedin: resumeData.linkedin || '',
    },
    validationRules
  )

  useEffect(() => {
    const savedData = loadResume()
    if (savedData) {
      setResumeData(savedData)
      setHistory([savedData])
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (formikRef.current) {
      try {
        const errors = await formikRef.current.validateForm();
        if (Object.keys(errors).length > 0) {
          throw new Error('Validation failed');
        }
        await saveResume(resumeData);
      } catch (error) {
        throw error;
      }
    }
  }, [resumeData]);
  
  

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setResumeData(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  useKeyboardShortcuts(handleSave, handleUndo)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sections = Array.from(resumeData.sections)
    const [reorderedSection] = sections.splice(result.source.index, 1)
    sections.splice(result.destination.index, 0, reorderedSection)

    setResumeData({ ...resumeData, sections })
    updateHistory({ ...resumeData, sections })
  }

  const handleDataChange = (newData: Partial<ResumeData>) => {
    const updatedData = { ...resumeData, ...newData }
    setResumeData(updatedData)
    updateHistory(updatedData)
  }

  const handleSectionChange = (sectionId: string, data: Partial<Section>) => {
    const updatedSections = resumeData.sections.map(section =>
      section.id === sectionId ? { ...section, ...data } : section
    )
    handleDataChange({ sections: updatedSections })
  }

  const updateHistory = (newData: ResumeData) => {
    setHistory([...history.slice(0, historyIndex + 1), newData])
    setHistoryIndex(historyIndex + 1)
  }

  const handleExport = useCallback(async () => {
    if (validateAll()) {
      try {
        await exportToPDF(resumeRef, `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`)
        alert('Resume exported successfully!')
      } catch (error) {
        console.error('Error exporting PDF:', error)
        alert('An error occurred while exporting the resume. Please try again.')
      }
    } else {
      alert('Please fix the validation errors before exporting.')
    }
  }, [validateAll, resumeData.name])

  return (
    <div className="flex flex-col h-screen">
      <Header
        onSave={handleSave}
        onLoad={(data) => {
          setResumeData(data)
          updateHistory(data)
        }}
        onExport={handleExport}
        resumeData={resumeData}
      />
      <div className="flex flex-1 overflow-hidden">
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
  )
}

