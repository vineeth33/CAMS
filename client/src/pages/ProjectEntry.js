"use client"

import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ProjectEntry = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    industryName: "",
    duration: "",
    title: "",
    principalInvestigator: "",
    coPrincipalInvestigator: "",
    academicYear: "",
    amountSanctioned: "",
    amountReceived: "",
    billSettlementDetails: "",
    studentDetails: "",
    summary: "",
  })

  const [files, setFiles] = useState({
    billSettlementProof: null,
    agreementDocument: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFiles((prev) => ({
      ...prev,
      [name]: files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.industryName ||
      !formData.title ||
      !formData.principalInvestigator ||
      !formData.academicYear ||
      !formData.amountSanctioned
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // File validation
    if (!files.agreementDocument) {
      toast.error("Please upload the signed agreement document")
      return
    }

    setIsLoading(true)

    try {
      // Create form data for file upload
      const projectFormData = new FormData()

      // Add all text fields
      Object.keys(formData).forEach((key) => {
        projectFormData.append(key, formData[key])
      })

      // Add files
      if (files.billSettlementProof) {
        projectFormData.append("billSettlementProof", files.billSettlementProof)
      }

      if (files.agreementDocument) {
        projectFormData.append("agreementDocument", files.agreementDocument)
      }

      // Submit the form
      const response = await axios.post("http://localhost:5173/api/projects", projectFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Project added successfully!")
      navigate(`/project/${response.data.id}`)
    } catch (error) {
      console.error("Error adding project:", error)
      toast.error(error.response?.data?.message || "Failed to add project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
      <div className="flex items-center mb-6">
        <div className="h-10 w-2 bg-indigo-500 rounded mr-3"></div>
        <h2 className="text-2xl font-bold text-white">Add New Consultancy Project</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Project Information */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Basic Project Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Industry Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="industryName"
                value={formData.industryName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Duration (in months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Principal Investigator (PI) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="principalInvestigator"
                value={formData.principalInvestigator}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Co-Principal Investigator (Co-PI)</label>
              <input
                type="text"
                name="coPrincipalInvestigator"
                value={formData.coPrincipalInvestigator}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Financial Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              >
                <option value="">Select Year</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2020-2021">2020-2021</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Amount Sanctioned (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">₹</span>
                </div>
                <input
                  type="number"
                  name="amountSanctioned"
                  value={formData.amountSanctioned}
                  onChange={handleChange}
                  className="pl-8 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount Received (₹)</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">₹</span>
                </div>
                <input
                  type="number"
                  name="amountReceived"
                  value={formData.amountReceived}
                  onChange={handleChange}
                  className="pl-8 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bill Settlement */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Bill Settlement</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bill Settlement Details</label>
              <textarea
                name="billSettlementDetails"
                value={formData.billSettlementDetails}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bill Settlement Proof (PDF)</label>
              <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label htmlFor="billSettlementProof" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input
                        id="billSettlementProof"
                        name="billSettlementProof"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">PDF up to 10MB</p>
                </div>
              </div>
              {files.billSettlementProof && (
                <p className="mt-2 text-sm text-indigo-400">
                  File selected: {files.billSettlementProof.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Agreement Document */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Agreement Document</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Signed Agreement Document (PDF) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="agreementDocument" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input
                      id="agreementDocument"
                      name="agreementDocument"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">PDF up to 10MB</p>
              </div>
            </div>
            {files.agreementDocument && (
              <p className="mt-2 text-sm text-indigo-400">
                File selected: {files.agreementDocument.name}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Additional Information</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Student Details (Name, ID, Role)</label>
              <textarea
                name="studentDetails"
                value={formData.studentDetails}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                placeholder="Enter student details, one per line (Name, ID, Role)"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Summary (max 100 words) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              ></textarea>
              <div className="mt-1 flex justify-between">
                <p className="text-sm text-gray-400">{formData.summary.length}/500 characters</p>
                <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${formData.summary.length > 400 ? 'bg-red-500' : formData.summary.length > 250 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(formData.summary.length / 500) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectEntry