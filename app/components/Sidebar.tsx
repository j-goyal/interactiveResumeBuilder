import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ResumeData, Section } from "../types";
import SectionForm from "./SectionForm";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { resumeValidationSchema } from "@/app/utils/validationSchema";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface SidebarProps {
  resumeData: ResumeData;
  onDataChange: (data: Partial<ResumeData>) => void;
  onSectionChange: (sectionId: string, data: Partial<Section>) => void;
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
}

const Sidebar = forwardRef(
  (
    {
      resumeData,
      onDataChange,
      onSectionChange,
      activeTemplate,
      setActiveTemplate,
    }: SidebarProps,
    ref: React.Ref<any>
  ) => {
  const formikRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    validateForm: formikRef.current?.validateForm,
    submitForm: formikRef.current?.submitForm,
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
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Resume Sections</h2>
      {/* Template Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Template
        </label>
        <select
          value={activeTemplate}
          onChange={(e) => setActiveTemplate(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="creative">Creative</option>
        </select>
      </div>

      {/* Formik Form for Profile Information */}
      <Formik
        innerRef={formikRef}
        initialValues={resumeData} // Automatically uses resumeData to pre-fill the form
        validationSchema={resumeValidationSchema}
        onSubmit={(values) => {
          onDataChange(values); // Update the parent component with new data
        }}
        enableReinitialize // Ensure that the form updates if resumeData changes
      >
        {({ handleSubmit, values, handleChange }) => (
          <Form onBlur={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Profile Information
              </h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Field
                    name="name" // Binds to the name property in resumeData
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Name"
                    value={values.name} // Dynamically set the value from Formik's state
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update Formik state
                      onDataChange({ ...values, name: e.target.value }); // Update parent on change
                    }}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Title */}
                <div>
                  <Field
                    name="title" // Binds to the title property in resumeData
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    value={values.title} // Dynamically set the value from Formik's state
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update Formik state
                      onDataChange({ ...values, title: e.target.value }); // Update parent on change
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <Field
                    name="email" // Binds to the email property in resumeData
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                    value={values.email} // Dynamically set the value from Formik's state
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update Formik state
                      onDataChange({ ...values, email: e.target.value }); // Update parent on change
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Field
                    name="phone" // Binds to the phone property in resumeData
                    type="tel"
                    className="w-full p-2 border rounded"
                    placeholder="Phone"
                    value={values.phone} // Dynamically set the value from Formik's state
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update Formik state
                      onDataChange({ ...values, phone: e.target.value }); // Update parent on change
                    }}
                  />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Location */}
                <div>
                  <Field
                    name="location" // Binds to the location property in resumeData
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Location"
                    value={values.location} // Dynamically set the value from Formik's state
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update Formik state
                      onDataChange({ ...values, location: e.target.value }); // Update parent on change
                    }}
                  />
                </div>

                {/* GitHub */}
                <div>
                  <Field
                    name="github" // Binds to the github property in resumeData
                    type="url"
                    className="w-full p-2 border rounded"
                    placeholder="GitHub Profile URL"
                    value={values.github} // Dynamically set the value from Formik's state
                  />
                  <ErrorMessage
                    name="github"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <Field
                    name="linkedin" // Binds to the linkedin property in resumeData
                    type="url"
                    className="w-full p-2 border rounded"
                    placeholder="LinkedIn Profile URL"
                    value={values.linkedin} // Dynamically set the value from Formik's state
                  />
                  <ErrorMessage
                    name="linkedin"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Sections */}
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
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
                      // Apply vertical transformation only when dragging
                      transform: snapshot.isDragging
                        ? `translateY(${
                            provided.draggableProps.style?.transform?.split(
                              ")"
                            )[1] || 0
                          })`
                        : undefined, // Remove transform when not dragging
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
