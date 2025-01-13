import { Section } from '../types'

interface SectionFormProps {
  section: Section
  onChange: (data: Partial<Section>) => void
  onRemove: () => void
}

export default function SectionForm({ section, onChange, onRemove }: SectionFormProps) {
  return (
    <div>
      <input
        type="text"
        value={section.title}
        onChange={(e) => onChange({ title: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Section Title"
      />
      <textarea
        value={section.content}
        onChange={(e) => onChange({ content: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Section Content"
        rows={4}
      />
      <button
        onClick={onRemove}
        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
      >
        Remove Section
      </button>
    </div>
  )
}

