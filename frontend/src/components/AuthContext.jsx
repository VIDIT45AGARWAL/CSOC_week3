import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = 'http://localhost:8000/api'
  const GOOGLE_CLIENT_ID = '985755597225-j9pcucchg5ek2e5ll6q2nuutjg5cfh1e.apps.googleusercontent.com'

  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      axios
        .get(`${API_URL}/snippets/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('user'))
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const setUserFromGoogleResponse = async (codeResponse) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google/`, {
      code: codeResponse.code
    })
    const { access, user } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return true
  } catch (error) {
    console.error('Google login failed:', error.response?.data || error.message)
    
    
    if (error.response?.data?.error) {
      toast.error(`Login failed: ${error.response.data.error}`)
    } else {
      toast.error('Login failed. Please try again.')
    }
    
    return false
  }
}


  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUserFromGoogleResponse, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)