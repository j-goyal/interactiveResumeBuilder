import { ResumeData } from '../types'

export const saveResume = (data: ResumeData) => {
  localStorage.setItem('resumeData', JSON.stringify(data))
}

export const loadResume = (): ResumeData | null => {
  const data = localStorage.getItem('resumeData')
  return data ? JSON.parse(data) : null
}

export const downloadResumeJSON = (data: ResumeData) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'resume.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const uploadResumeJSON = (file: File): Promise<ResumeData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

