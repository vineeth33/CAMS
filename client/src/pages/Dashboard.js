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
          axios.get(`${API_BASE_URL}/api/projects/stats?user=${currentUser.id}`),
          axios.get(`${API_BASE_URL}/api/projects/recent`),
        ])

        setStats(statsResponse.data)
        setRecentProjects(projectsResponse.data.filter((project) => project.userId === currentUser.id))
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome, {currentUser?.name}!</h1>
            <p className="text-gray-400">Here's an overview of your consultancy projects</p>
          </div>
          <div className="mt-4 md:mt-0 bg-gray-800 rounded-lg px-4 py-2 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            <span className="text-gray-300 text-sm">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden group hover:border-purple-500 transition-all duration-300">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500 opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-300"></div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
            <div className="mt-4 flex items-center text-gray-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                <path d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" />
              </svg>
              <span>Lifetime</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden group hover:border-green-500 transition-all duration-300">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-green-500 opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-300"></div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-green-400">{stats.activeProjects}</p>
            <div className="mt-4 flex items-center text-gray-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>In progress</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden group hover:border-blue-500 transition-all duration-300">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500 opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-300"></div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Completed Projects</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.completedProjects}</p>
            <div className="mt-4 flex items-center text-gray-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Successfully delivered</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden group hover:border-purple-500 transition-all duration-300">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500 opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-300"></div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Amount (₹)</h3>
            <p className="text-3xl font-bold text-purple-400">
              {new Intl.NumberFormat("en-IN").format(stats.totalAmount)}
            </p>
            <div className="mt-4 flex items-center text-gray-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span>Revenue generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/project/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg flex items-center transition-colors duration-200 shadow-md"
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
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-3 rounded-lg flex items-center transition-colors duration-200 shadow-md border border-gray-700"
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

          <Link
            to="/reports"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-3 rounded-lg flex items-center transition-colors duration-200 shadow-md border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Analytics & Reports
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
            </svg>
            Recent Projects
          </h2>
          <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
            {recentProjects.length} projects
          </span>
        </div>

        {recentProjects.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-800 transition-colors duration-200">
                <Link to={`/project/${project.id}`} className="block">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-purple-400">{project.title}</h3>
                    <div className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                      {project.academicYear}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-400">{project.industryName}</span>
                    <span className="text-green-400 font-medium">
                      ₹{new Intl.NumberFormat("en-IN").format(project.amountSanctioned)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-400 items-center">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      PI: {project.principalInvestigator}
                    </span>
                    <div className="w-20 bg-gray-700 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="bg-gray-800 inline-block p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-400 mb-6">No projects found. Start by adding a new project.</p>
            <Link
              to="/project/new"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md"
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