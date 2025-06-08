import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../components/AuthContext'

const Login = () => {
    const { user, setUserFromGoogleResponse } = useAuth()
    const navigate = useNavigate()

    if (user) {
        navigate('/home')
    }

    const login = useGoogleLogin({
        flow: 'auth-code',
        redirect_uri: 'http://localhost:5173',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        onSuccess: async (codeResponse) => {
        console.log('Google codeResponse:', codeResponse)
        const success = await setUserFromGoogleResponse(codeResponse)
        if (success) {
            navigate('/home')
        }
        },
        onError: (error) => {
        console.error('Google Login Error:', error)
        },
    })

    const handleLogin = () => {
        login()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-80 sm:w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Welcome to SnippetHUB
        </h1>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center w-full bg-purple-700 text-white rounded-lg p-3 text-lg hover:bg-purple-600 transition-colors cursor-pointer"
        >
          <i className="bx bxl-google mr-2 text-2xl"></i>
          Login with Google
        </button>
      </div>
    </div>
    )
}

export default Login