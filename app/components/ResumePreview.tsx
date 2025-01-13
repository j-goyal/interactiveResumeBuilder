import { forwardRef } from 'react'
import { ResumeData } from '../types'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import CreativeTemplate from './templates/CreativeTemplate'

interface ResumePreviewProps {
  resumeData: ResumeData
  template: string
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, template }, ref) => {
    const renderTemplate = () => {
      switch (template) {
        case 'modern':
          return <ModernTemplate resumeData={resumeData} />
        case 'classic':
          return <ClassicTemplate resumeData={resumeData} />
        case 'creative':
          return <CreativeTemplate resumeData={resumeData} />
        default:
          return <ModernTemplate resumeData={resumeData} />
      }
    }

    return (
      <div className="w-3/4 bg-white p-8 overflow-y-auto">
        <div ref={ref} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {renderTemplate()}
        </div>
      </div>
    )
  }
)

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview

