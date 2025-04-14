"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!email.endsWith(".edu") && !email.endsWith(".ac.in")) {
      toast.error("Please use a valid college email address")
      return
    }

    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success("Login successful!")
        navigate("/")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred during login")
      console.error(error)
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
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-400">Login to CAMS</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              College Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                className="bg-gray-700 border border-gray-600 rounded-lg w-full py-3 px-4 pl-10 text-gray-100 placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                placeholder="your.name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                className="bg-gray-700 border border-gray-600 rounded-lg w-full py-3 px-4 pl-10 text-gray-100 placeholder-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 w-full transition-colors duration-200 flex justify-center items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
