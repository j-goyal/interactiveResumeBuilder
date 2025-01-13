export interface ResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  github?: string
  linkedin?: string
  sections: Section[]
}

export interface Section {
  id: string
  type: string
  title: string
  content: string
}

