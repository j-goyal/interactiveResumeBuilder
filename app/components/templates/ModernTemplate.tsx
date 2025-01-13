import { ResumeData } from '../../types'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

interface ModernTemplateProps {
  resumeData: ResumeData
}

export default function ModernTemplate({ resumeData }: ModernTemplateProps) {
  return (
    <article className="font-sans text-gray-900 leading-normal">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{resumeData.name}</h1>
        <p className="text-xl text-gray-600">{resumeData.title}</p>
        <address className="mt-2 text-gray-600 not-italic">
          <p>{resumeData.email} | {resumeData.phone}</p>
          <p>{resumeData.location}</p>
          <div className="flex mt-2 space-x-4">
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
        </address>
      </header>
      {resumeData.sections.map((section) => (
        <section key={section.id} className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
            {section.title}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </section>
      ))}
    </article>
  )
}

