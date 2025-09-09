"use client"

import { useTodo } from "../context/TodoContext"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const validationSchema = Yup.object({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string().max(500, "Description must be less than 500 characters"),
  folderId: Yup.string().required("Please select a folder"),
  tags: Yup.string().test("tags-validation", "Each tag must be less than 20 characters", (value) => {
    if (!value) return true
    const tags = value.split(",").map((tag) => tag.trim())
    return tags.every((tag) => tag.length <= 20)
  }),
})

function AddTodoForm({ onClose }) {
  const { folders, actions, loading } = useTodo()

  const initialValues = {
    title: "",
    description: "",
    folderId: "default",
    tags: "",
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const tagArray = values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await actions.addTodo({
        title: values.title.trim(),
        description: values.description.trim(),
        folderId: values.folderId,
        tags: tagArray,
      })

      resetForm()
      onClose()
    } catch (error) {
      console.error("Error adding todo:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title && touched.title ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              <ErrorMessage name="title" component="span" className="text-red-600 text-xs mt-1 block" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description && touched.description ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
                rows="3"
                placeholder="Enter task description (optional)"
              />
              <ErrorMessage name="description" component="span" className="text-red-600 text-xs mt-1 block" />
            </div>

            <div>
              <label htmlFor="folderId" className="block text-sm font-medium text-gray-700 mb-2">
                Folder
              </label>
              <Field
                as="select"
                id="folderId"
                name="folderId"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.folderId && touched.folderId ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="folderId" component="span" className="text-red-600 text-xs mt-1 block" />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Field
                type="text"
                id="tags"
                name="tags"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.tags && touched.tags ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
                placeholder="Enter tags separated by commas (e.g., work, urgent, meeting)"
              />
              <ErrorMessage name="tags" component="span" className="text-red-600 text-xs mt-1 block" />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                disabled={isSubmitting || loading.creating}
              >
                {(isSubmitting || loading.creating) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isSubmitting || loading.creating ? "Adding..." : "Add Task"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                disabled={isSubmitting || loading.creating}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddTodoForm
