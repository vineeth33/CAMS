"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

// Base URL for API requests
const API_BASE_URL = "http://localhost:5173"

const ProjectList = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    academicYear: "",
    amountThreshold: "",
    facultyName: "",
    industryName: "",
  })
  const [downloadLoading, setDownloadLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/projects`)
      setProjects(response.data.filter())
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = async () => {
    try {
      setLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()

      if (filters.academicYear) {
        queryParams.append("academicYear", filters.academicYear)
      }

      if (filters.amountThreshold) {
        queryParams.append("amountThreshold", filters.amountThreshold)
      }

      if (filters.facultyName) {
        queryParams.append("facultyName", filters.facultyName)
      }

      if (filters.industryName) {
        queryParams.append("industryName", filters.industryName)
      }

      const response = await axios.get(`${API_BASE_URL}/api/projects?${queryParams.toString()}`)
      setProjects(response.data)
    } catch (error) {
      console.error("Error applying filters:", error)
      toast.error("Failed to filter projects")
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      academicYear: "",
      amountThreshold: "",
      facultyName: "",
      industryName: "",
    })
    fetchProjects()
  }

  const downloadExcel = async () => {
    try {
      setDownloadLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()

      if (filters.academicYear) {
        queryParams.append("academicYear", filters.academicYear)
      }

      if (filters.amountThreshold) {
        queryParams.append("amountThreshold", filters.amountThreshold)
      }

      if (filters.facultyName) {
        queryParams.append("facultyName", filters.facultyName)
      }

      if (filters.industryName) {
        queryParams.append("industryName", filters.industryName)
      }

      const response = await axios.get(`${API_BASE_URL}/api/projects/download?${queryParams.toString()}`, {
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `consultancy-projects-${new Date().toISOString().split("T")[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success("Excel file downloaded successfully")
    } catch (error) {
      console.error("Error downloading Excel:", error)
      toast.error("Failed to download Excel file")
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Consultancy Projects</h2>
          <Link
            to="/project/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Filter Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2020-2021">2020-2021</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Threshold</label>
              <select
                name="amountThreshold"
                value={filters.amountThreshold}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Amounts</option>
                <option value="50000">Above ₹50,000</option>
                <option value="100000">Above ₹1,00,000</option>
                <option value="500000">Above ₹5,00,000</option>
                <option value="1000000">Above ₹10,00,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
              <input
                type="text"
                name="facultyName"
                value={filters.facultyName}
                onChange={handleFilterChange}
                placeholder="Enter faculty name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Name</label>
              <input
                type="text"
                name="industryName"
                value={filters.industryName}
                onChange={handleFilterChange}
                placeholder="Enter industry name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button
              onClick={downloadExcel}
              disabled={downloadLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
            >
              {downloadLoading ? (
                <span>Downloading...</span>
              ) : (
                <>
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
                  Download Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Industry
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Principal Investigator
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Academic Year
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount (₹)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      <Link to={`/project/${project.id}`}>{project.title}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.industryName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.principalInvestigator}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.academicYear}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat("en-IN").format(project.amountSanctioned)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.duration} months</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/project/${project.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg">No projects found matching your criteria.</p>
          <p className="mt-2">Try adjusting your filters or add a new project.</p>
        </div>
      )}
    </div>
  )
}

export default ProjectList

