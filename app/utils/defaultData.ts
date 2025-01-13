import { ResumeData } from '../types'

export const defaultResumeData: ResumeData = {
  name: 'Your Name',
  title: 'Software Developer',
  email: 'name@example.com',
  phone: '+911234567890',
  location: 'India, IN',
  github: 'https://github.com/url',
  linkedin: 'https://www.linkedin.com/in/url',
  sections: [
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      content: '<ul><li><strong>Software Developer, ABC Inc.</strong><br>brief summary</li></ul>',
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      content: '<ul><li><strong>BTech in Computer Science</strong><br>University of Technology, 20xx-20xx</li></ul>',
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      content: '<ul><li>skill1</li><li>skill2</li><li>skill3</li></ul>',
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      content: '<ul><li><strong>Project1</strong><br>brief summary</li><li><strong>Project2</strong><br>brief summary</li></ul>',
    },
  ],
}

