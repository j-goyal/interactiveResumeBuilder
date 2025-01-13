import { ResumeData } from '../../types'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

interface CreativeTemplateProps {
  resumeData: ResumeData
}

export default function CreativeTemplate({ resumeData }: CreativeTemplateProps) {
  return (
    <div className="p-8 font-sans bg-gradient-to-br from-purple-100 to-pink-100">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {resumeData.name}
        </h1>
        <p className="text-2xl text-gray-700 mt-2">{resumeData.title}</p>
        <div className="mt-4 text-gray-600">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resumeData.sections.map((section) => (
          <section key={section.id} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              {section.title}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        ))}
      </div>
    </div>
  )
}

