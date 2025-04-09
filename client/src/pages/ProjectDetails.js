"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate, useParams } from "react-router-dom"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5173/api/projects/${id}`)
        setProject(response.data)
      } catch (error) {
        console.error("Error fetching project details:", error)
        toast.error("Failed to load project details")
        navigate("/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, navigate])

  const handleDownloadFile = async (fileType) => {
    try {
      const response = await axios.get(`http://localhost:5173/api/projects/${id}/download/${fileType}`, {
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${fileType}-${project.title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success("File downloaded successfully")
    } catch (error) {
      console.error(`Error downloading ${fileType}:`, error)
      toast.error(`Failed to download ${fileType}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
            <p className="text-gray-600 mt-1">{project.industryName}</p>
          </div>
          <Link to="/projects" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Project Information</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Principal Investigator</p>
                <p className="mt-1">{project.principalInvestigator}</p>
              </div>

              {project.coPrincipalInvestigator && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Co-Principal Investigator</p>
                  <p className="mt-1">{project.coPrincipalInvestigator}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Academic Year</p>
                <p className="mt-1">{project.academicYear}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1">{project.duration} months</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Project Summary</p>
                <p className="mt-1 text-gray-700">{project.summary}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Financial Information</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Sanctioned</p>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  ₹{new Intl.NumberFormat("en-IN").format(project.amountSanctioned)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Amount Received</p>
                <p className="mt-1">
                  {project.amountReceived
                    ? `₹${new Intl.NumberFormat("en-IN").format(project.amountReceived)}`
                    : "Not received yet"}
                </p>
              </div>

              {project.billSettlementDetails && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Bill Settlement Details</p>
                  <p className="mt-1">{project.billSettlementDetails}</p>
                </div>
              )}

              {/* Document Downloads */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Documents</p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleDownloadFile("agreement")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download Agreement Document
                  </button>

                  {project.billSettlementProof && (
                    <button
                      onClick={() => handleDownloadFile("billSettlement")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download Bill Settlement Proof
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Details */}
        {project.studentDetails && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Student Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{project.studentDetails}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails

