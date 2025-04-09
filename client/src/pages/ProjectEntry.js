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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Consultancy Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Project Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="industryName"
              value={formData.industryName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Duration (in months) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Principal Investigator (PI) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="principalInvestigator"
              value={formData.principalInvestigator}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Co-Principal Investigator (Co-PI)</label>
            <input
              type="text"
              name="coPrincipalInvestigator"
              value={formData.coPrincipalInvestigator}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Financial Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Year</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2020-2021">2020-2021</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Sanctioned (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amountSanctioned"
                value={formData.amountSanctioned}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
              <input
                type="number"
                name="amountReceived"
                value={formData.amountReceived}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bill Settlement */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Bill Settlement</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Settlement Details</label>
              <textarea
                name="billSettlementDetails"
                value={formData.billSettlementDetails}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Settlement Proof (PDF)</label>
              <input
                type="file"
                name="billSettlementProof"
                onChange={handleFileChange}
                accept=".pdf"
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">Upload a PDF file of the bill settlement proof.</p>
            </div>
          </div>
        </div>

        {/* Agreement Document */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Agreement Document</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Signed Agreement Document (PDF) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="agreementDocument"
              onChange={handleFileChange}
              accept=".pdf"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Upload a PDF file of the signed agreement document.</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Additional Information</h3>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Details (Name, ID, Role)</label>
              <textarea
                name="studentDetails"
                value={formData.studentDetails}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter student details, one per line (Name, ID, Role)"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Summary (max 100 words) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">{formData.summary.length}/500 characters</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectEntry

