import { ResumeData } from '../types'

const validateResumeData = (data: any): data is ResumeData => {
  return (
    typeof data.name === 'string' &&
    typeof data.title === 'string' &&
    typeof data.email === 'string' &&
    typeof data.phone === 'string' &&
    typeof data.location === 'string' &&
    typeof data.github === 'string' &&
    typeof data.linkedin === 'string' &&
    Array.isArray(data.sections) &&
    data.sections.every(
      (section: any) =>
        typeof section.id === 'string' &&
        typeof section.type === 'string' &&
        typeof section.title === 'string' &&
        typeof section.content === 'string'
    )
  );
};

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
        if (validateResumeData(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid resume data format'));
        }
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

