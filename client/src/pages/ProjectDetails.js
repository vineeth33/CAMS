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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-gray-950 text-center py-16 rounded-lg border border-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Project Not Found</h2>
        <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-200">
          Back to Projects
        </Link>
      </div>
    )
  }

  // Generate status tag based on project details
  const getStatusTag = () => {
    if (project.amountReceived && project.billSettlementDetails) {
      return (
        <span className="bg-green-900 text-green-200 text-xs font-medium px-2.5 py-1 rounded-full border border-green-800">
          Completed
        </span>
      )
    } else if (project.amountReceived) {
      return (
        <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-800">
          In Progress
        </span>
      )
    } else {
      return (
        <span className="bg-yellow-900 text-yellow-200 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-800">
          Pending
        </span>
      )
    }
  }

  return (
    <div className="bg-gray-950 text-gray-100">
      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 p-6 border-b border-gray-800">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
              <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {getStatusTag()}
                <span className="text-gray-400 text-sm">Project ID: {project.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              <p className="text-gray-300 mt-1">{project.industryName}</p>
            </div>
            <Link to="/projects" className="text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center bg-gray-800 bg-opacity-50 rounded-lg px-4 py-2 border border-gray-700">
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
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700 flex items-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Project Information
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-400">Principal Investigator</p>
                  <p className="mt-1 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold mr-2">
                      {project.principalInvestigator.charAt(0)}
                    </span>
                    {project.principalInvestigator}
                  </p>
                </div>

                {project.coPrincipalInvestigator && (
                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-400">Co-Principal Investigator</p>
                    <p className="mt-1 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-2">
                        {project.coPrincipalInvestigator.charAt(0)}
                      </span>
                      {project.coPrincipalInvestigator}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-400">Academic Year</p>
                    <p className="mt-1">{project.academicYear}</p>
                  </div>

                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-400">Duration</p>
                    <p className="mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {project.duration} months
                    </p>
                  </div>
                </div>

                <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-400">Project Summary</p>
                  <p className="mt-1 text-gray-300">{project.summary}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700 flex items-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Financial Information
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200 flex-1">
                    <p className="text-sm font-medium text-gray-400">Amount Sanctioned</p>
                    <p className="mt-1 text-lg font-semibold text-green-400">
                      ₹{new Intl.NumberFormat("en-IN").format(project.amountSanctioned)}
                    </p>
                  </div>

                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200 flex-1">
                    <p className="text-sm font-medium text-gray-400">Amount Received</p>
                    <p className="mt-1 text-lg font-semibold">
                      {project.amountReceived
                        ? <span className="text-blue-400">₹{new Intl.NumberFormat("en-IN").format(project.amountReceived)}</span>
                        : <span className="text-yellow-400">Not received yet</span>}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-850 rounded-md p-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.amountReceived ? `${Math.round((project.amountReceived / project.amountSanctioned) * 100)}%` : '0%'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: project.amountReceived ? `${Math.round((project.amountReceived / project.amountSanctioned) * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                {project.billSettlementDetails && (
                  <div className="bg-gray-850 hover:bg-gray-750 rounded-md p-3 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-400">Bill Settlement Details</p>
                    <p className="mt-1">{project.billSettlementDetails}</p>
                  </div>
                )}

                {/* Document Downloads */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-400 mb-3">Documents</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleDownloadFile("agreement")}
                      className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg w-full transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
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
                        className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg w-full transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-purple-400"
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
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Student Details
              </h3>
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{project.studentDetails}</pre>
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              <span className="block">Created at: {new Date().toLocaleDateString()}</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/project/edit/${project.id}`}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Edit Project
              </Link>
              <Link
                to={`/project/report/${project.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Generate Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails