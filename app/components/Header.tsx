import { useState } from 'react'
import { ResumeData } from '../types'
import { downloadResumeJSON, saveResume, uploadResumeJSON } from '../utils/storage'

interface HeaderProps {
  onSave: () => void
  onLoad: (data: ResumeData) => void
  onExport: () => Promise<void>
  resumeData: ResumeData
}

export default function Header({ onSave, onLoad, onExport, resumeData }: HeaderProps) {
  const [shareLink, setShareLink] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleSave = async () => {
    try {
      await onSave();
      downloadResumeJSON(resumeData);
      alert('Resume saved and downloaded successfully!');
    } catch (error) {
      alert('Please fix the validation errors before saving.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport()
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = () => {
    const encodedData = btoa(JSON.stringify(resumeData))
    const link = `${window.location.origin}?data=${encodedData}`
    setShareLink(link)
    navigator.clipboard.writeText(link)
    alert('Share link copied to clipboard!')
  }

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const data = await uploadResumeJSON(file)
        onLoad(data);
        saveResume(data);
        alert('Resume loaded successfully!')
      } catch (error) {
        alert('Error loading resume. Please try again.')
      }
    }
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interactive Resume Builder</h1>
        <div className="space-x-4">
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
            Save
          </button>
          <label className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded cursor-pointer">
            Load
            <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
          </label>
          <button 
            onClick={handleExport} 
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button onClick={handleShare} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">
            Share
          </button>
        </div>
      </div>
    </header>
  )
}

