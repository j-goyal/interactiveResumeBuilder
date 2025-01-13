import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ResumeData, Section } from "../types";
import SectionForm from "./SectionForm";
import { Formik, Field, Form, ErrorMessage, FormikProps, FormikValues, FormikErrors } from "formik";
import { resumeValidationSchema } from "@/app/utils/validationSchema";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface SidebarProps {
  resumeData: ResumeData;
  onDataChange: (data: Partial<ResumeData>) => void;
  onSectionChange: (sectionId: string, data: Partial<Section>) => void;
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
}

interface FormikMethods {
  validateForm: (values?: FormikErrors<FormikValues>) => Promise<FormikErrors<FormikValues>>;
  submitForm: () => Promise<void>;
}

type InputField = {
  name: string;
  placeholder: string;
  type?: string;
};

const inputFields: InputField[] = [
  { name: "name", placeholder: "Name" },
  { name: "title", placeholder: "Title" },
  { name: "email", placeholder: "Email", type: "email" },
  { name: "phone", placeholder: "Phone", type: "tel" },
  { name: "location", placeholder: "Location" },
  { name: "github", placeholder: "GitHub Profile URL", type: "url" },
  { name: "linkedin", placeholder: "LinkedIn Profile URL", type: "url" },
];

const Sidebar = forwardRef(
  (
    {
      resumeData,
      onDataChange,
      onSectionChange,
      activeTemplate,
      setActiveTemplate,
    }: SidebarProps,
    ref: React.Ref<FormikMethods>
  ) => {
    const formikRef = useRef<FormikProps<FormikValues>>(null);

    useImperativeHandle(ref, () => ({
      validateForm: formikRef.current?.validateForm || (() => Promise.resolve<FormikErrors<FormikValues>>({})),
      submitForm: formikRef.current?.submitForm || (() => Promise.resolve()),
    }));

    const handleAddSection = () => {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        type: "custom",
        title: "New Section",
        content: "",
      };
      onDataChange({ sections: [...resumeData.sections, newSection] });
    };

    const handleRemoveSection = (sectionId: string) => {
      onDataChange({
        sections: resumeData.sections.filter(
          (section) => section.id !== sectionId
        ),
      });
    };

    return (
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 overflow-y-auto h-screen lg:h-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Resume Sections</h2>

        {/* Template Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Template
          </label>
          <select
            value={activeTemplate}
            onChange={(e) => setActiveTemplate(e.target.value)}
            className="text-gray-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Formik Form for Profile Information */}
        <Formik
          innerRef={formikRef}
          initialValues={resumeData}
          validationSchema={resumeValidationSchema}
          onSubmit={(values) => onDataChange(values)}
          enableReinitialize
        >
          {({ handleSubmit, values, handleChange }) => (
            <Form onBlur={handleSubmit}>
              <div className="mb-4  text-gray-900">
                <h3 className="text-lg font-semibold mb-2">
                  Profile Information
                </h3>
                <div className="space-y-4">
                  {inputFields.map(({ name, placeholder, type = "text" }) => (
                    <div key={name}>
                      <Field
                        name={name}
                        type={type}
                        className="w-full p-2 border rounded"
                        placeholder={placeholder}
                        value={values[name as keyof typeof values]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          onDataChange({ ...values, [name]: e.target.value });
                        }}
                      />
                      <ErrorMessage
                        name={name}
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* Sections */}
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4  text-gray-900"
            >
              {resumeData.sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        background: snapshot.isDragging
                          ? "#f0f0f0"
                          : "transparent",
                        transition: snapshot.isDragging
                          ? "transform 0.2s ease"
                          : undefined,
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="mb-4 bg-white p-4 rounded shadow"
                      >
                        <SectionForm
                          section={section}
                          onChange={(data) => onSectionChange(section.id, data)}
                          onRemove={() => handleRemoveSection(section.id)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add Section Button */}
        <button
          onClick={handleAddSection}
          className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
        >
          Add Section
        </button>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
