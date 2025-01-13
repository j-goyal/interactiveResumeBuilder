import { ResumeData } from '../../types'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

interface ClassicTemplateProps {
  resumeData: ResumeData
}

export default function ClassicTemplate({ resumeData }: ClassicTemplateProps) {
  return (
    <div className="p-8 font-serif">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{resumeData.name}</h1>
        <p className="text-xl text-gray-700">{resumeData.title}</p>
        <div className="mt-2 text-gray-600">
          <p>{resumeData.email} | {resumeData.phone}</p>
          <p>{resumeData.location}</p>
          <div className="flex justify-center mt-2 space-x-4">
            {resumeData.github && (
              <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-800">
                <FaGithub className="mr-1" /> GitHub
              </a>
            )}
            {resumeData.linkedin && (
              <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-800">
                <FaLinkedin className="mr-1" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>
      {resumeData.sections.map((section) => (
        <section key={section.id} className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase mb-4">
            {section.title}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </section>
      ))}
    </div>
  )
}

