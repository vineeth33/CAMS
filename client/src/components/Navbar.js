"use client"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen && !e.target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('click', closeDropdown)

    return () => {
      document.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-bold text-purple-400 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0-3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>CAMS</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-6">
                  <Link to="/" className="hover:text-purple-400 transition-colors duration-200 font-medium">
                    Dashboard
                  </Link>
                  <Link to="/projects" className="hover:text-purple-400 transition-colors duration-200 font-medium">
                    Projects
                  </Link>
                  <Link to="/project/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                    New Project
                  </Link>
                </div>
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                      {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline mr-1">{currentUser?.name || "User"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-purple-400"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-purple-400"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar