"use client"

import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// Base URL for API requests
const API_BASE_URL = "http://localhost:5173"

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Verify token with backend
          const response = await axios.get(`${API_BASE_URL}/api/auth/verify`)

          setCurrentUser(response.data.user)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Auth verification failed:", error)
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
        }
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setCurrentUser(user)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log("Sending registration data:", userData)

      // Use axios directly with the full URL
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Registration response:", response.data)
      return { success: true, message: response.data.message }
    } catch (error) {
      console.error("Registration error details:", error.response || error)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

