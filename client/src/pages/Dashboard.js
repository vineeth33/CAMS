"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Base URL for API requests
const API_BASE_URL = "http://localhost:5173"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalAmount: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, projectsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects/stats`),
          axios.get(`${API_BASE_URL}/api/projects/recent`),
        ])

        setStats(statsResponse.data)
        setRecentProjects(projectsResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {currentUser?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your consultancy projects</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Completed Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Amount (₹)</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Intl.NumberFormat("en-IN").format(stats.totalAmount)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
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

          <Link
            to="/projects"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            View All Projects
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
        </div>

        {recentProjects.length > 0 ? (
          <div className="divide-y">
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                <Link to={`/project/${project.id}`} className="block">
                  <h3 className="font-medium text-blue-600">{project.title}</h3>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">{project.industryName}</span>
                    <span className="text-gray-600">
                      ₹{new Intl.NumberFormat("en-IN").format(project.amountSanctioned)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>PI: {project.principalInvestigator}</span>
                    <span>{project.academicYear}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No projects found. Start by adding a new project.</p>
            <Link
              to="/project/new"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add New Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

