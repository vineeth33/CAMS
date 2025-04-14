"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.email.endsWith(".edu") && !formData.email.endsWith(".ac.in")) {
      toast.error("Please use a valid college email address")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
      })

      if (result.success) {
        toast.success("Registration successful! Please login.")
        navigate("/login")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-700 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0-3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-400">Register for CAMS</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { id: 'email', label: 'College Email', type: 'email', placeholder: 'your.name@college.edu' },
            { id: 'department', label: 'Department', type: 'text', placeholder: 'Computer Science' },
            { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label className="block text-sm font-medium mb-2" htmlFor={id}>
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                className="bg-gray-700 border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-100 placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                placeholder={placeholder}
                value={formData[id]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div>
            <button
              type="submit"
              className={`bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 w-full transition-colors duration-200 flex justify-center items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
